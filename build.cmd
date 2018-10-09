call tsc -P %~dp0
call lessc "%~dp0theme/default.less" "%~dp0theme/default.css" --source-map
