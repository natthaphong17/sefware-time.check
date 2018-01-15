// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAxN4cfRhLzSb1-IxYKY9_1f_7v6abNfxI',
    authDomain: 'sefware-cores.firebaseapp.com',
    databaseURL: 'https://sefware-cores.firebaseio.com',
    projectId: 'sefware-cores',
    storageBucket: 'sefware-cores.appspot.com',
    messagingSenderId: '242005092591'
  },
  // api: 'https://us-central1-sefware-pos.cloudfunctions.net'
};
