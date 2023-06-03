// Client ID from Google Cloud Console
const CLIENT_ID = '1045348257642-6edfv9hlglp10kjum6smts4cardc29fk.apps.googleusercontent.com';

// Initialize Google Sign-In API
function initGoogleSignIn() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: CLIENT_ID,
    }).then(function() {
      attachSignInHandler();
    });
  });
}

// Attach sign-in handler to the sign-in button
function attachSignInHandler() {
  const signInButton = document.createElement('div');
  signInButton.setAttribute('id', 'googleSignInButton');
  document.body.appendChild(signInButton);

  gapi.signin2.render('googleSignInButton', {
    'scope': 'https://www.googleapis.com/auth/drive.file',
    'width': 200,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
  });
}

// Handle successful sign-in
function onSignIn(googleUser) {
  const user = googleUser.getBasicProfile();
  const accessToken = googleUser.getAuthResponse().access_token;
  const uploadForm = document.getElementById('uploadForm');
  uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    uploadFile(file, accessToken);
  });
}

// Upload file to Google Drive
function uploadFile(file, accessToken) {
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  })
    .then(response => {
      if (response.ok) {
        alert('Assignment uploaded successfully!');
      } else {
        alert('Error uploading assignment.');
      }
    })
    .catch(error => {
      console.error('Error uploading assignment:', error);
    });
}

// Load Google Sign-In API script
(function() {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = function() {
    initGoogleSignIn();
  };
  document.body.appendChild(script);
})();
