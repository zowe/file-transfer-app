
REM This program and the accompanying materials are
REM made available under the terms of the Eclipse Public License v2.0 which accompanies
REM this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
REM 
REM SPDX-License-Identifier: EPL-2.0
REM 
REM Copyright Contributors to the Zowe Project.
set MVD_DESKTOP_DIR=..\..\zlux-app-manager\virtual-desktop

copy .\org.zowe.filetransfer.json ..\zlux-example-server\plugins\org.zowe.filetransfer.json
copy .\org.zowe.filetransfer.json ..\zlux-example-server\deploy\instance\ZLUX\plugins

REM copy .\common\FTATypes.ts .\nodeServer\ts\FTATypes.ts
REM copy .\common\FTATypes.ts .\webClient\src\app\services\FTATypes.ts

pushd .\nodeServer
call npm install && call npm run build
robocopy /S node_modules ..\lib\node_modules\
popd

pushd .\webClient
call npm install && call npm run build
popd

pause
REM This program and the accompanying materials are
REM made available under the terms of the Eclipse Public License v2.0 which accompanies
REM this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
REM 
REM SPDX-License-Identifier: EPL-2.0
REM 
REM Copyright Contributors to the Zowe Project.
