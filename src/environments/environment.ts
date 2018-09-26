// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// UAT: http://frozen.reddyice.com/reddyice_dev/iceboxapisqldev
// DEV: http://frozen.reddyice.com/myicebox_dev2/


export const environment = {
  production: false,
  //apiEndpoint: 'http://192.168.30.115/MyIceApi_Support/',
  apiEndpoint: 'https://buat-myicebox.reddyice.com/myiceboxAPI/',
  reportEndpoint: 'https://buat-myicebox.reddyice.com/MyIceBoxReports/Reports/ReportData.aspx',
  inventoryEndpoint: 'https://buat-myicebox.reddyice.com/Inventory_Icebox/forms/addBom.aspx',
  prodLabel: '(BUAT)',
  EDIUserName : 'MyiceboxEDI'
};
