/* reference doc https://developers.google.com/picker/docs */
function GoogleDrive(config) {
	window.onpopstate = () => {
		document.body.querySelectorAll('.picker').forEach((el) => {
			el.remove();
		});
	};
	const CLIENT_ID = '387451133785-kbbknocb89d2lph41djn0ela0bi6fbdo.apps.googleusercontent.com';
	const SCOPES =
		'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly';
	let oauthToken, pickerApiLoaded, me;
	let clicked = false;
	document.getElementById(config.buttonId) &&
		document.getElementById(config.buttonId).addEventListener('click', () => {
			uploadcall();
		});

	const construct = function(me2) {
		me = me2;
		let script = document.createElement('script');
		script.src = 'https://www.google.com/jsapi?key=' + config.apiKey;
		document.getElementsByTagName('head')[0].appendChild(script);
		script = document.createElement('script');

		script.src = 'https://apis.google.com/js/api.js?onload=handleClientLoad';
		document.getElementsByTagName('head')[0].appendChild(script);
		script = document.createElement('script');
		script.src = 'https://apis.google.com/js/client.js';
		document.getElementsByTagName('head')[0].appendChild(script);
		return me2;
	};

	const loadPickerApi = function() {
		pickerApiLoaded = true;
		createPicker();
	};

	// Called when the client library is loaded to start the auth flow.
	window.handleClientLoad = function() {
		gapi.load('auth', onAuthApiLoad);
		gapi.load('picker', loadPickerApi);
	};

	// Check if the current user has authorized the application.
	const onAuthApiLoad = function() {
		window.gapi.auth.authorize(
			{
				client_id: CLIENT_ID,
				scope: SCOPES,
				immediate: true
			},
			handleAuthResult
		);
	};
	/**
   * Called when authorization server replies.
   *
   * @param {Object} authResult Authorization result.
   */
	const handleAuthResult = function(authResult) {
		if (authResult && !authResult.error) {
			oauthToken = authResult.access_token;
		}

		if (clicked === true) {
			createPicker();
			clicked = false;
		}
	};

	this.uploadcall = function() {
		if (me.isUploadAllowed() === false) {
			return;
		}

		clicked = true;
		if (oauthToken !== true) {
			window.gapi.auth.authorize(
				{
					client_id: CLIENT_ID,
					scope: SCOPES,
					immediate: false
				},
				handleAuthResult
			);
		} else {
			createPicker();
			clicked = false;
		}
	};

	// Create and render a Picker object for searching images.
	function createPicker() {
		if (pickerApiLoaded && oauthToken) {
			var view = new google.picker.View(google.picker.ViewId.DOCS);
			//view.setMimeTypes("application/pdf,application/vnd.google-apps.document");
			var picker = new google.picker.PickerBuilder()
				.enableFeature(google.picker.Feature.NAV_HIDDEN)
				.setAppId('515809593152')
				.setOAuthToken(oauthToken)
				.addView(view)
				//.setDeveloperKey(developerKey)
				.setCallback(pickerCallback)
				.build();
			picker.setVisible(true);
		}
	}

	const fileIds = []; // contains ids of files selected from picker

	const pickerCallback = function(data) {
		if (data.action === google.picker.Action.PICKED) {
			for (let i = 0; i < data.docs.length && i < me.params.maxNumOfFiles; i++) {
				fileIds[i] = data.docs[i].id;
			}
			downloadFile(0);
		}
	};

	let downloadFile = function(i) {
		let request;

		window.gapi.client.load('drive', 'v2', function() {
			request = window.gapi.client.drive.files.get({
				fileId: fileIds[i]
			});

			request.execute(function(resp) {
				const isWeirdGoogleDriveFileType =
					(resp.title.indexOf('.') === -1 || resp.exportLinks) && resp.mimeType === config.mimeType;
				// BUG FIX checking just title of file fails if there exist a native Google file with name ending in valid extension (eg. xyzfile.doc)
				let filename = resp.title;
				if (isWeirdGoogleDriveFileType) filename += config.appendExtension;

				const validationDetails = me.validateBeforeUpload(filename, resp.fileSize);
				if (!validationDetails.isValid) {
					me.params.callback.call(window, validationDetails.callbackArguments);
				} else {
					const fileInfo = {};
					fileInfo.fileName = filename;
					fileInfo.id = resp.id;

					if (!(resp.downloadUrl === null || resp.downloadUrl === '')) {
						fileInfo.fileLink = resp.downloadUrl;
					}
					if (isWeirdGoogleDriveFileType) {
						fileInfo.fileLink = resp.exportLinks[config.exportLink];
					}
					fileInfo.fileToken = window.gapi.auth.getToken() && window.gapi.auth.getToken().access_token;

					me.serverHit(fileInfo);
				}
				if (fileIds.length !== i + 1) {
					downloadFile(i + 1);
				}
			});
		});
	};

	return construct(this);
}

export default GoogleDrive;
