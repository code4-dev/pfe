Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$mvnPath = Join-Path $projectRoot ".tools\\apache-maven-3.9.12\\bin\\mvn.cmd"
$mvnCommand = $null

if (Test-Path $mvnPath) {
  $mvnCommand = $mvnPath
} else {
  $globalMaven = Get-Command mvn -ErrorAction SilentlyContinue
  if ($null -ne $globalMaven) {
    $mvnCommand = "mvn"
  } else {
    throw "Maven not found. Local Maven missing at $mvnPath and no global 'mvn' in PATH."
  }
}

Push-Location $projectRoot
try {
  & $mvnCommand spring-boot:run
} finally {
  Pop-Location
}
