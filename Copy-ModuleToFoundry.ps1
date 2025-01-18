param (
    [Parameter()]
    [string]
    $FoundryModuleDirectory
)

$foldersToCopy = @('.\scripts\', '.\languages\', '.\styles\', '.\packs\')

$foldersToCopy | Copy-Item -Recurse -Destination "$FoundryModuleDirectory" -Force
Copy-Item .\module.json -Destination "$FoundryModuleDirectory\module.json" -Force
