// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// UAT: http://frozen.reddyice.com/reddyice_dev/iceboxapisqldev
// DEV: http://frozen.reddyice.com/myicebox_dev2/

// apiEndpoint: 'http://frozen.reddyice.com/iceboxapisqldev/',
//  reportEndpoint: 'http://frozen.reddyice.com/iceboxReportSqldev/Reports/ReportData.aspx',
// apiEndpoint: 'http://frozen.reddyice.com/reddyice_dev/',
// reportEndpoint: 'http://frozen.reddyice.com/DashboardReports/Reports/ReportData.aspx',
// apiEndpoint: 'http://frozen.reddyice.com/IceBoxApi_Support/',axchangeapi
// reportEndpoint: 'https://myicebox.reddyice.com/DashBoardReportsProd/Reports/ReportData.aspx',DashboardReportsPhase3
// apiEndpoint: http://frozen.reddyice.com/reddyicephase3mock/,
// reportEndpoint: http://frozen.reddyice.com/reddyicereportphase3mock/Reports/ReportData.aspx,
//apiEndpoint: 'http://frozen.reddyice.com/axchangeapi/',
//reportEndpoint: 'http://frozen.reddyice.com/DashboardReportsPhase3/Reports/ReportData.aspx',

export const environment = {
  production: false,
  //apiEndpoint: 'http://192.168.30.115/LookUpKillSession/',
 apiEndpoint: 'https://buat-myicebox.reddyice.com/myiceboxAPI/',
  reportEndpoint: 'https://buat2-myicebox.reddyice.com/MyIceBoxReports/Reports/ReportData.aspx',
  inventoryEndpoint: 'https://buat2-myicebox.reddyice.com/DA_Inventory/forms/addBom.aspx',
  prodLabel: '(Performance)',
  EDIUserName : 'MyiceboxEDI'
};
