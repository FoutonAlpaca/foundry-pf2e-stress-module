$packageFolder = Join-Path -Path "$PSScriptRoot" -ChildPath "package"
$releaseFolder = Join-Path -Path "$PSScriptRoot" -ChildPath "release"
$copyScript = Resolve-Path -Path "$PSScriptRoot\..\Copy-ModuleToFoundry.ps1"

function Reset-Folder {
  param (
    $FolderPath
  )

  Remove-Item -Path $FolderPath -Recurse -Force -ErrorAction Ignore
  New-Item -Path $FolderPath -ItemType Directory | Out-Null
}

Reset-Folder -FolderPath $packageFolder
Reset-Folder -FolderPath $releaseFolder

& "$copyScript" -FoundryModuleDirectory $packageFolder
Compress-Archive -Path "$packageFolder\*" -DestinationPath "$releaseFolder\module.zip"
Copy-Item -Path "$packageFolder\module.json" -Destination "$releaseFolder\module.json"
