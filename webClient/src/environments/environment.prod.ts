

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

export const environment = {
  production: true
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
  tabTypes : ["InProgress", "Cancel", "Completed"]
}

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

