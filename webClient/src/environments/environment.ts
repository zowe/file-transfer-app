

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false
};

export const prod_config = {
  limitofActivityHistory : 10,
  downloadQueueLength : 5,
  actions : ["Upload","Transfer", "Download"],
  statusList: ["In progress", "Complete", "Cancel", "Queued"],
  activityIcons: {
    "upload" : "<<--",
    "download" : "-->>",
    "transfer" : "<-->"
  },
  priority: ["Normal", "High"],
  tableHeaders : ["Server Local file","Direction","Remote file","Size","Priority","Status","Actions"],
  tabTypes : ["InProgress", "Cancel", "Completed"],
  helperText: ["Donwload Queue size to maintain", "History of the donwload objects to keep in memory"],
  encodings: {
    "ASCII" : "iso8859-1", 
    "EBCDIC": "ebcdic-1047",
    "UTF8" : "utf8"
  }
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

