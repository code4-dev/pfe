Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$mvnPath = Join-Path $projectRoot ".tools\\apache-maven-3.9.12\\bin\\mvn.cmd"

if (-not (Test-Path $mvnPath)) {
  throw "Local Maven not found at $mvnPath"
}

Push-Location $projectRoot
try {
  & $mvnPath spring-boot:run
} finally {
  Pop-Location
}
