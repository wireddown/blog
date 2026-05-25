param(
    [Parameter(Mandatory=$true, HelpMessage="The title for the new draft")]
    [string]$PostTitle
)

# Detect git repo and root
$gitRepoRoot = & git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}
$draftsDir = Join-Path $gitRepoRoot "all_collections" "_drafts"

# Convert to slug name with only lowercase alphanumerics and hyphens
$slugName = $PostTitle -replace '[^a-zA-Z0-9]', '-' -replace '-+', '-'
$slugName = $slugName.ToLower()

# Prepend timestamp to slug
$slugDate = (Get-Date).ToString('yyyy-MM-dd')
$newPostFullSlug = "${slugDate}-${slugName}"

$newPostFileName = Join-Path $draftsDir "${newPostFullSlug}.md"
if (Test-Path $newPostFileName) {
    Write-Host "Error: Draft already exists!" -ForegroundColor Red
    Write-Host "  `"$newPostFileName`""
    exit 1
}

# Create drafts directory if it doesn't exist
New-Item -ItemType Directory -Path $draftsDir -Force | Out-Null

# Create the new file with front matter
$frontMatter = @"
---
layout: post
title: $PostTitle
tags: []
---

_It's typing time!_
"@
Set-Content -Path $newPostFileName -Value $frontMatter -Encoding UTF8

Write-Host "Created new draft! Edit this file:" -ForegroundColor Green
Write-Host "  `"$newPostFileName`""
