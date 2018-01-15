// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDFPsNA8VduyPnbzQhzbkb0Rxru8sYeMjc',
    authDomain: 'sefware-time.firebaseapp.com',
    databaseURL: 'https://sefware-time.firebaseio.com',
    projectId: 'sefware-time',
    storageBucket: 'sefware-time.appspot.com',
    messagingSenderId: '579646227381'
  },
  // api: 'https://us-central1-sefware-pos.cloudfunctions.net'
};
