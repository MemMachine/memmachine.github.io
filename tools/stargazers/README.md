# Stargazer Companies Extractor

This tool fetches the list of GitHub stargazers for a specified repository, retrieves their associated company names from their GitHub profiles, and outputs a YAML file listing unique companies. Optionally, it can be extended to fetch company logos for each company.

## How It Works

- Uses the GitHub API to fetch stargazers for a given repository (default: `memmachine/memmachine`).
- For each stargazer, fetches their user profile and extracts the company name if available.
- Collects all unique company names and writes them to `companies.yaml` in a format suitable for use in a logo marquee (`data/logos.yaml`) or similar feature, including an optional logo URL.
- Can be extended to fetch company logos using a real API.

## Requirements

- Python 3.7+
- The following Python packages:
  - `requests`
  - `pyyaml`

## Installation (Recommended: Python Virtual Environment)

1. Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install requirements:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. (Optional) Set the `GITHUB_TOKEN` environment variable for higher API rate limits:

   ```bash
   export GITHUB_TOKEN=your_github_token
   ```

2. (Optional) Enable debug logging:

   ```bash
   export DEBUG=1
   ```

3. Run the script:

   ```bash
   python tools/stargazers/stargazer_companies.py
   ```

4. The output file `companies.yaml` will be created in the current directory.

## Output

- `companies.yaml`: Contains a list of unique companies in the format:

  ```yaml
  - name: "Acme Corp"
    src: ""  # logo URL (optional)
  ```

## Extending

- To fetch company logos, implement the `find_logo_url(company_name)` function with a real logo API.
