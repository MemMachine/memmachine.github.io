import requests
import yaml
import os
import time
import logging

REPO = "memmachine/memmachine"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MAX_USERS = 500

# Logging setup
DEBUG = os.getenv("DEBUG", "0").lower() in {"1", "true", "yes"}
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def get_headers():
    """
    Returns HTTP headers for GitHub API requests, using GITHUB_TOKEN if available.
    """
    if GITHUB_TOKEN:
        logger.debug("Using authenticated GitHub API access.")
        return {"Authorization": f"token {GITHUB_TOKEN}"}
    logger.info("No GITHUB_TOKEN provided, using unauthenticated GitHub access.")
    return {}

def clean_company_name(company):
    """
    Cleans and normalizes a company name string from a GitHub profile.
    Removes leading/trailing whitespace and '@' if present.
    Returns None if company is empty.
    """
    if company:
        company = company.strip()
        if company.startswith('@'):
            company = company[1:].strip()
        return company
    return None

def get_stargazers(repo, max_users=MAX_USERS):
    """
    Fetches up to max_users GitHub stargazers for the given repository.
    Returns a list of usernames.
    """
    users = []
    page = 1
    logger.info(f"Fetching stargazers for {repo}...")
    while len(users) < max_users:
        url = f"https://api.github.com/repos/{repo}/stargazers?per_page=100&page={page}"
        r = requests.get(url, headers=get_headers())
        logger.debug(f"HTTP {r.status_code} on stargazers page {page}")
        if r.status_code != 200:
            logger.error(f"GitHub API error: {r.status_code} - {r.text}")
            break
        batch = r.json()
        if not batch:
            logger.info("No more stargazers found.")
            break
        for user in batch:
            logger.info(f"Found user: {user.get('login')}")
        users += batch
        page += 1
        time.sleep(1)
    logger.info(f"Total stargazers fetched: {len(users)}")
    return [u['login'] for u in users]

def get_company(username):
    """
    Fetches the company name for a given GitHub username.
    Returns the cleaned company name or None if not available.
    """
    url = f"https://api.github.com/users/{username}"
    logger.debug(f"Fetching user profile: {username}")
    r = requests.get(url, headers=get_headers())
    if r.status_code == 200:
        company = r.json().get('company')
        cleaned_company = clean_company_name(company)
        if cleaned_company:
            logger.info(f"User '{username}': company '{cleaned_company}'")
            return cleaned_company
        else:
            logger.info(f"User '{username}': no company listed")
    else:
        logger.warning(f"Failed to fetch profile for '{username}': {r.status_code}")
    return None

def find_logo_url(company_name):
    """
    Placeholder for finding a company's logo URL given its name.
    Returns an empty string. Extend with a real API if needed.
    """
    logger.debug(f"Looking for logo of company: {company_name}")
    # Placeholder - always blank, can be replaced with a real API if available
    return ""

def main():
    """
    Main execution function. Fetches stargazers, extracts companies, writes YAML output.
    """
    users = get_stargazers(REPO)
    companies = set()
    for idx, username in enumerate(users):
        company = get_company(username)
        if company:
            companies.add(company)
        time.sleep(1)  # Remove or lower for very small runs
    logger.info(f"Found {len(companies)} unique companies.")

    yaml_data = []
    for company in sorted(companies, key=lambda x: x.lower()):
        logo_url = find_logo_url(company)
        logger.info(f"Company: {company} - Logo: {logo_url or '(none)'}")
        yaml_data.append({"name": company, "src": logo_url or ""})

    out_file = "companies.yaml"
    with open(out_file, "w") as f:
        yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True)
    logger.info(f"Wrote companies to {out_file}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted by user. Exiting cleanly.")
