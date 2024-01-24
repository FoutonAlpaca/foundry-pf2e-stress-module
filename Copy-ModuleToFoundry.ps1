param (
    [Parameter()]
    [string]
    $FoundryModuleDirectory
)

$foldersToCopy = @('.\scripts\', '.\languages\')

$foldersToCopy | Copy-Item -Recurse -Destination "$FoundryModuleDirectory" -Force
Copy-Item .\module.json -Destination "$FoundryModuleDirectory\module.json" -Force
