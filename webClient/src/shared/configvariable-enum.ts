/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

export enum ConfigVariables {
  limitofActivityHistory = 10,
  downloadQueueLength = 5,
  uploadAction = "Upload",
  transferAction = "Transfer", 
  downloadAction = "Download",
  statusInprogress = "In progress",
  statusComplete = "Complete", 
  statusCancel = "Cancel", 
  statusQueued = "Queued",
  upload = "<<--",
  download = "-->>",
  transfer = "<-->",
  HighPriority = "High",
  LowPriority = "Normal",
  TableHeader1 = "Server Local file",
  TableHeader2 = "Direction",
  TableHeader3 = "Remote file",
  TableHeader4 = "Size",
  TableHeader5 = "Priority",
  TableHeader6 = "Status",
  TableHeader7 = "Actions",
  InProgressTab = "InProgress",
  CancelTab = "Cancel",
  CompletedTab = "Completed",
  DownloadQueueHelperText = "Donwload Queue size to maintain", 
  DownloadHistoryHelperText = "History of the download objects to keep in memory",
  ASCII = "819", 
  EBCDIC = "1047",
  UTF8 = "1208",
  Upload_Config_Notification_Hanlder = "Config Service Notification",
  Upload_Config_Notification_Message = "Updated User Config for the File Transfer App",
  Download_Config_Notification_Hanlder = "Download Service Notification",
  Download_Config_Notification_Message = "Downloaded file ",
  Download_Config_Cancel_Notification_Message = "Download canceld for file ",
 }