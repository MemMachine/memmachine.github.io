---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
featured_image: "featured_image.png"
tags: []
author: ""
description: ""
draft: true
---
{{/* NOTE: Hugo silently hides posts whose date is in the future. Keep date = today or earlier. */}}
