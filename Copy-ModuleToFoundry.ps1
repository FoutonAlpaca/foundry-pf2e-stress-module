param (
    [Parameter()]
    [string]
    $FoundryModuleDirectory,
    [switch]
    $SkipPacks
) 

$foldersToCopy = @('.\scripts\', '.\languages\', '.\styles\')
if (-not $SkipPacks) {
    $foldersToCopy += '.\packs\'
}

$foldersToCopy | Copy-Item -Recurse -Destination "$FoundryModuleDirectory" -Force
Copy-Item .\module.json -Destination "$FoundryModuleDirectory\module.json" -Force
