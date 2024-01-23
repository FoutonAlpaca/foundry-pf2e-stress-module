param (
    [Parameter()]
    [string]
    $FoundryModuleDirectory
)

Copy-Item .\scripts\ -Recurse -Destination "$FoundryModuleDirectory" -Force
Copy-Item .\module.json -Destination "$FoundryModuleDirectory\module.json" -Force
