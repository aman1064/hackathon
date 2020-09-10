/* eslint-disable no-loop-func */
import $ from "jquery";

import GoogleDrivePlugin from "../plugins/MygdrivePlugin";
import { trackCleverTap } from "../tracking";
import getAccessToken from "../../utils/getAccessToken";
import tracker from "../../analytics/tracker";

window.GoogleDrive = GoogleDrivePlugin;

// add parameter: preventAddFileKeyInStack
// reason: since in single upload while on delete file form server, it push previous file version history in stack

/*
changes for, delete file automatically when max file size is 1(one)
 no delete file call needed from outside */
export function NCUploader(params) {
  let UploaderIns;
  let uploadsLeft;
  let fileKeys = [];
  const _ins = this;

  const construct = function(me) {
    me.params = params;
    uploadsLeft = params.maxNumOfFiles || 0;
    fileKeys = params.fileKeys;
    if (canUseAdvanceUploader()) {
      NCAdvancedUploder.prototype = me; // change the parent of the instance to be created to 'this'
      UploaderIns = new NCAdvancedUploder();
    } else {
      uploadsLeft = 1;
      me.params.maxNumOfFiles = 1;
      NCBasicUploader.prototype = me; // change the parent of the instance to be created to 'this'
      UploaderIns = new NCBasicUploader();
    }
    $("#" + me.params.fileId).on("click", function() {
      this.value = null;
    });
    $("#" + me.params.fileId).on("change", UploaderIns.upload);

    if ($.isEmptyObject(me.params.plugins) === false) {
      pluginCreater(
        params,
        UploaderIns.pluginCallback,
        UploaderIns.isUploadAllowed,
        UploaderIns.getFileKey
      );
    }
    if (me.params.uploadedFile) {
      createUploadProgressCompleteBar(me);
    }
    return UploaderIns;
  };

  const canUseAdvanceUploader = function() {
    return (
      params.forceBasicUploader !== true &&
      typeof File !== "undefined" &&
      typeof FileList !== "undefined"
    );
  };

  const pluginCreater = function(
    params,
    pluginCallback,
    isUploadAllowed,
    getFileKey
  ) {
    for (const pluginName in params.plugins) {
      // pluginHandler(pluginName, params, pluginCallback, isUploadAllowed, getFileKey);
      pluginHandler.call(
        window,
        pluginName,
        params,
        pluginCallback,
        isUploadAllowed,
        getFileKey,
        _ins
      );
    }
  };

  this.deleteFileFromServer = function(fileKey, fileName) {
    const url = params.targets.deleteUrl;
    if (!url) {
      return;
    }
    $.ajax({
      url,
      type: "POST",
      data: "{}",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      contentType: "json"
    }).done(function(data) {
      $("input").val("");
      localStorage.setItem("cvFileUrl", "");
      tracker().on("ctapEvent", {
        hitName: "cv_delete"
      });
      tracker().on("ctapProfile", {
        hitName: "cv_delete",
        payload: {
          does_cv_exist: false
        }
      });
      if (data[fileKey] && typeof data[fileKey].ERROR !== "undefined") {
        const callbackArguments = {
          ERROR: {}
        };

        callbackArguments.ERROR[fileKey] = {
          name: fileName,
          error: "DELETE_ERROR " + data[fileKey].ERROR
        };
        params.callback.call(window, callbackArguments);
      }
    });
  };

  this.pluginCallback = function(type, args) {
    let callbackArguments = {};
    if (type === "success") {
      updateCount("dec");

      callbackArguments = {
        SUCCESS: []
      };
      if (args) {
        callbackArguments.SUCCESS = args;
        params.callback.call(window, callbackArguments);
      }
    } else if (type === "error") {
      callbackArguments = {
        ERROR: []
      };
      if (args) {
        callbackArguments.ERROR = args;
        params.callback.call(window, callbackArguments);
      }
    } else if (type === "limitExceed") {
      callbackArguments = {
        ERROR: "MAX LIMIT REACHED"
      };
      params.callback.call(window, callbackArguments);
    } else if (type === "selectionExceeded") {
      callbackArguments = {
        ERROR: "SELECTION EXCEEDED"
      };
      params.callback.call(window, callbackArguments);
    } else if (type === "remove") {
      this.deleteFile(args.fileKey, args.name);
    }
  };

  this.deleteFile = function(fileKey, name, shouldFileInputBeKeptHidden) {
    updateCount("inc", shouldFileInputBeKeptHidden);
    if (!params.preventAddFileKeyInStack) {
      fileKeys.push(fileKey);
    }
    this.deleteFileFromServer(fileKey, name);
  };

  const updateCount = function(action, shouldFileInputBeKeptHidden) {
    shouldFileInputBeKeptHidden = shouldFileInputBeKeptHidden || false;
    if (action === "inc") {
      uploadsLeft++;
      if (uploadsLeft === 1 && !shouldFileInputBeKeptHidden) {
        for (const pluginName in params.plugins) {
          $("#" + params.plugins[pluginName].buttonId).show();
          // $('#' + params.plugins[pluginName].buttonId).attr("disabled", "none");
        }
        // $('#' + params.dropAreaParams.id).show();
        $("#" + params.fileId).show();
      }
      if (uploadsLeft === params.maxNumOfFiles) {
        $("#" + params.outputHolder.id).hide();
      }
    }

    if (action === "dec") {
      if (params.maxNumOfFiles > 1) {
        uploadsLeft--;
      }
      /* uploadsLeft--; */
      if (uploadsLeft === 0) {
        if (document.ajaxq) document.ajaxq.q["uploadqueue"] = [];
        for (const pluginName in params.plugins) {
          $("#" + params.plugins[pluginName].buttonId).hide();
          // $('#' + params.plugins[pluginName].buttonId).attr("disabled", "disabled");
        }
        $("#" + params.dropAreaParams.id).hide();
        $("#" + params.fileId).hide();
      }
    }
  };

  this.isUploadAllowed = function() {
    if (uploadsLeft <= 0) return false;
  };

  this.getFileKey = function() {
    const _fk = params.maxNumOfFiles > 1 ? fileKeys.pop() : fileKeys;
    return _fk;
  };

  return construct(this); // THIS SHOULD ALWAYS BE PLACED AT THE END OF THIS CLASS.
}

const createUploadProgressCompleteBar = me => {
  const $progress = $(
    '<p class="file_upload_label complete">File upload complete</p><span class="progress materialize"><span class="determinate" style="width: 100%"></span></span>'
  );
  const res = $("<li>")
    .attr({
      id: "completedProgressBar"
    })
    .html("<div class='file_upload_name'>" + me.params.uploadedFile + "</div>")
    .append($progress)
    .append(
      $("<button class='cancel-upload'>").on("click", function(e) {
        e.preventDefault();
        $("#completedProgressBar").remove();
        me.deleteFileFromServer();
        if (typeof me.params.onCancelClick === "function") {
          me.params.onCancelClick();
        }
      })
    );
  if (me.params.outputHolder) $("#" + me.params.outputHolder.id).append(res);
};

const ncUploaderUtil = {
  getRandomString: function() {
    return new Date().getTime() + "_" + (Math.random() + "").replace(".", "_");
  },
  cancel: function() {
    if (document.ajaxq.r) {
      document.ajaxq.r.abort();
    }
  }
};

const NCBasicUploader = function() {
  let me;
  let file;
  const construct = function(me2) {
    me = me2;
    file = getCurrentFile();
    $("#" + me.params.containerId).show();
    return me;
  };

  const getCurrentFile = function() {
    return $("#" + me.params.fileId)[0];
  };

  this.upload = function() {
    file = getCurrentFile();
    if (!file.value) {
      return;
    }
    const validationDetails = validateBeforeUpload();
    if (!validationDetails.isValid) {
      me.params.callback.call(window, validationDetails.callbackArguments);
      return;
    }
    showProgressBar();
    const uploadFormId = createUploadForm();
    const uploadIframeName = createUploadIframe();
    submitUploadIframe(uploadFormId, uploadIframeName);
    //        me.pluginCallback("success"); // to hide buttons of plugins
  };

  const validateBeforeUpload = function() {
    let isValid = true;
    const callbackArguments = {
      ERROR: []
    };

    let isExtensionValid = false;
    const extension = file.value
      .slice(file.value.lastIndexOf(".") + 1)
      .toLowerCase();
    if (extension !== file.value) {
      for (let i = 0; i < me.params.extensions.length; ++i) {
        if (extension === me.params.extensions[i]) {
          isExtensionValid = true;
          break;
        }
      }
    }
    if (!isExtensionValid) {
      isValid = false;
      callbackArguments.ERROR = {
        dummyFileKey: {
          error: "INVALID_EXTENSION"
        }
      };
    }

    return {
      isValid: isValid,
      callbackArguments: callbackArguments
    };
  };

  const showProgressBar = function() {
    $("#" + me.params.basicProgressBarId).show();
  };

  const createUploadFormCallbackUrl = function() {
    return $("<input>").attr({
      type: "hidden",
      name: "uploadCallbackUrl",
      value:
        (window.location.origin ||
          window.location.protocol + "//" + window.location.host) +
        me.params.callbackUrl
    })[0];
  };

  const createUploadFormCallback = function() {
    const callbackName = "uploadCallback_" + ncUploaderUtil.getRandomString();
    (function(me2) {
      window[callbackName] = function() {
        document.getElementById(me2.params.basicProgressBarId).style.display =
          "none";
        if (typeof me2.params.callback !== "undefined") {
          me2.params.callback.apply(window, arguments);
        }
      };
    })(me);
    return $("<input>").attr({
      type: "hidden",
      name: "uploadCallback",
      value: callbackName
    })[0];
  };

  const createUploadForm = function() {
    const formId = "form_" + ncUploaderUtil.getRandomString();
    const form = $("<form>").attr({
      id: formId,
      method: "POST",
      enctype: "multipart/form-data",
      action: me.params.targets.saveFileUrl
    });

    const fileObj = $("#" + me.params.fileId);
    $(fileObj.clone(true)).insertBefore(fileObj.next());
    fileObj.off("change"); // BUG FIX FOR
    // THIS LINE HAS TO BE KEPT JUST BEFORE file.style.display = "none" - since IE 7 @ Win XP fires a fake onchange event when file is hidden
    fileObj.hide();

    const appIdEle = $("<input>").attr({
      type: "hidden",
      name: "appId",
      value: me.params.appId
    });

    form
      .append(fileObj)
      .append(appIdEle)
      .append(createUploadFormCallbackUrl())
      .append(createUploadFormCallback())
      .appendTo("body");
    return formId;
  };

  const createUploadIframe = function() {
    const iframeName = "iframe_" + ncUploaderUtil.getRandomString();
    $('<iframe name="' + iframeName + '">')
      .attr({
        style: "position: absolute; top: -1000px; left: -1000px"
      })
      .appendTo("body");
    return iframeName;
  };

  const submitUploadIframe = function(formId, iframeName) {
    $("#" + formId).attr("target", iframeName).submit();
  };

  return construct(this); // THIS SHOULD ALWAYS BE THE LAST LINE OF THIS CLASS
};

const NCAdvancedUploder = function() {
  let me, files;

  const construct = function(me2) {
    me = me2;
    $("#" + me.params.containerId).show();

    if (me.params.dropAreaParams && me.params.dropAreaParams.id)
      holderInit($("#" + me.params.dropAreaParams.id));
    return me;
  };

  const holderInit = function(holder) {
    holder.on("drop", function(e) {
      e.preventDefault();
      me.params.files = e.originalEvent.dataTransfer.files;
      me.upload();
    });

    holder.on("dragover", function() {
      holder.addClass(me.params.dropAreaParams.onHoverCssClass);
      return false;
    });
    holder.on("dragleave", function() {
      holder.removeClass(me.params.dropAreaParams.onHoverCssClass);
      return false;
    });

    holder.show();
  };

  this.upload = function() {
    if (me.isUploadAllowed() === false) {
      me.pluginCallback("limitExceed");
      return;
    }

    if (typeof me.params.files === "undefined") {
      files = $("#" + me.params.fileId)[0].files;
    } else {
      files = me.params.files;
    }

    if (!files.length) {
      return;
    } else if (files.length > me.params.maxNumOfFiles) {
      me.pluginCallback("selectionExceeded");
      return;
    }

    const data = {
      // appId: me.params.appId
    };

    for (let i = 0; i < files.length; ++i) {
      const validationDetails = validateBeforeUpload(files[i]);
      if (!validationDetails.isValid) {
        // delete me.params.fileId;

        me.params.callback.call(window, validationDetails.callbackArguments);
      } else {
        $("#" + me.params.outputHolder.id).show();
        sendFile(data, files[i]);
        // sendFile(files[i]);
      }
    }
  };

  const validateBeforeUpload = function(file) {
    let isValid = true,
      isExtensionValid = false;
    const callbackArguments = {},
      extensions = me.params.extensions,
      extension = file["name"]
        .slice(file["name"].lastIndexOf(".") + 1)
        .toLowerCase();

    if (extension !== file.value) {
      for (let i = 0; i < extensions.length; ++i) {
        if (extension === extensions[i]) {
          isExtensionValid = true;
          break;
        }
      }
    }

    if (!isExtensionValid) {
      isValid = false;
      callbackArguments.ERROR = {
        dummyFileKey: {
          name: file["name"],
          error: "INVALID_EXTENSION"
        }
      };
    }
    if (file.size > me.params.maxSize) {
      isValid = false;
      callbackArguments.ERROR = {
        dummyFileKey: {
          name: file["name"],
          error: "FILE SIZE LIMIT EXCEEDED"
        }
      };
    }

    return {
      isValid: isValid,
      callbackArguments: callbackArguments
    };
  };

  const sendFile = function(data, file) {
    const formData = new FormData();
    const fr = new FileReader();
    fr.readAsDataURL(file);
    const blob = new Blob([file], { type: "application/pdf" });
    const cvFileUrl = window.URL.createObjectURL(blob);
    localStorage.setItem("cvFileUrl", cvFileUrl);

    const rno = ncUploaderUtil.getRandomString();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    formData.append("file", file);
    $.ajaxq("uploadqueue", {
      type: "POST",
      method: "POST",
      url: me.params.targets.saveFileUrl,
      enctype: "multipart/form-data",
      data: formData,
      processData: false,
      contentType: false,
      dataType: "json",
      xhrFields: {
        withCredentials: false
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      beforeSend: function() {
        if (typeof me.params.beforeSendCallback === "function") {
          me.params.beforeSendCallback();
        }
        let $progress = $('<progress class="progress">');
        if (me.params.materializeLoader) {
          $progress = $(
            '<p class="file_upload_label">File upload in progress...</p><span class="progress materialize"><span class="determinate"></span></span>'
          );
        }
        const res = $("<li>")
          .attr({
            id: rno
          })
          .html("<div class='file_upload_name'>" + file["name"] + "</div>")
          .append($progress)
          .append(
            $("<button class='cancel-upload'>").on("click", function() {
              ncUploaderUtil.cancel();
              $("#" + rno).remove();
              if (typeof me.params.onCancelClick === "function") {
                me.params.onCancelClick();
              }
            })
          );
        if (me.params.outputHolder)
          $("#" + me.params.outputHolder.id).append(res);
      },

      error: function() {
        $("#" + rno)
          .find(".file_upload_label")
          .addClass("error")
          .text("Upload Failed. Close and retry")
          .end()
          .find(".determinate")
          .attr("style", "");

        tracker().on("event", {
          hitName: "registration$cv_upload_failed$cv_upload"
        });
        if (me.params.isRegistration) {
          trackCleverTap("reg_Failed_cv_upload");
        } else if (me.params.isEdit) {
          trackCleverTap("edit_Failed_cv_upload");
        }
      },

      success: function(reponseData) {
        const args = {};

        for (const fileKey in reponseData) {
          if (typeof reponseData[fileKey].ERROR !== "undefined") {
            args[fileKey] = {
              name: file["name"],
              error: reponseData[fileKey].ERROR
            };
            me.pluginCallback("error", args);
            $("#" + rno).remove();
          } else {
            args[fileKey] = {
              name: file["name"],
              URL: reponseData[fileKey].URL,
              completeResp: reponseData.data
            };
            me.pluginCallback("success", args);

            $("#" + rno + ">button").unbind("click").bind("click", function() {
              $("#" + rno).remove();
              if (typeof me.params.onCancelClick === "function") {
                me.params.onCancelClick();
                me.deleteFileFromServer();
              }
            });
          }
        }
        $("#" + rno)
          .find(".file_upload_label")
          .addClass("complete")
          .text("File upload Complete");
        tracker().on("event", {
          hitName: `${params.category ||
            "registration"}$cv_upload_success$cv_upload`
        });
        tracker().on("ctapEvent", {
          hitName: "cv_upload"
        });
        tracker().on("ctapProfile", {
          hitName: "cv_upload",
          payload: {
            does_cv_exist: true
          }
        });
      },

      xhr: function() {
        const myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener(
            "progress",
            progressHandlerCreator($("#" + rno + ">.progress")),
            false
          );
        }
        return myXhr;
      },

      complete: function() {
        // executes after error or success
      }
    });
  };

  return construct(this); // THIS SHOULD ALWAYS BE THE LAST LINE OF THIS CLASS
};

function progressHandlerCreator(element) {
  let pHandler;
  const isMaterializeLoader = element.hasClass("materialize");

  if (isMaterializeLoader) {
    pHandler = function pHandler(e) {
      if (e.lengthComputable) {
        const perc = e.loaded / e.total * 100;
        element.find(".determinate").width(perc + "%");
      }
    };
  } else {
    pHandler = function pHandler(e) {
      if (e.lengthComputable) {
        element.attr({
          value: e.loaded,
          max: e.total
        });
      }
    };
  }
  return pHandler;
}

const pluginHandler = function(
  pluginName,
  params,
  callback,
  isUploadAllowed,
  getFileKey,
  ncUploaderIns
) {
  let me;
  const constructor = function(me2) {
    me = me2;
    me2.params = params;
    me2.isUploadAllowed = isUploadAllowed;
    window[pluginName](params.plugins[pluginName]);
    return me;
  };

  this.serverHit = function(fileInfo) {
    const rno = ncUploaderUtil.getRandomString();
    // const fK;
    if (!fileInfo.fileLink) return;
    const postBody = `{
      "fileId": "${fileInfo.id}",
      "accessToken": "${fileInfo.fileToken}"
    }`;
    $("#" + params.outputHolder.id).show();
    $.ajaxq("uploadqueue", {
      type: "POST",
      method: "POST",
      url: params.targets.saveCloudUrl,
      data: postBody,
      contentType: "application/json",
      dataType: "json",
      xhrFields: {
        withCredentials: false
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      beforeSend: function() {
        if (typeof me.params.beforeSendCallback === "function") {
          me.params.beforeSendCallback();
        }
        let $progress = $('<progress class="progress">');
        if (me.params.materializeLoader) {
          $progress = $(
            '<p class="file_upload_label">File upload in progress...</p><span class="progress materialize"><span class="determinate"></span></span>'
          );
        }
        const res = $("<li>")
          .attr({
            id: rno
          })
          .html("<div class='file_upload_name'>" + fileInfo.fileName + "</div>")
          .append($progress)
          .append(
            $("<button class='cancel-upload'>").on("click", function() {
              ncUploaderUtil.cancel();
              $("#" + rno).remove();
              if (typeof me.params.onCancelClick === "function") {
                me.params.onCancelClick();
              }
            })
          );
        if (params.outputHolder) $("#" + params.outputHolder.id).append(res);
      },

      success: function(reponseData) {
        const args = {};
        for (const fileKey in reponseData) {
          if (typeof reponseData[fileKey].ERROR !== "undefined") {
            args[fileKey] = {
              name: fileInfo.fileName,
              error: reponseData[fileKey].ERROR
            };
            callback("error", args);
            $("#" + rno).remove();
          } else {
            args[fileKey] = {
              name: fileInfo.fileName,
              URL: reponseData[fileKey].URL,
              completeResp: reponseData.data
            };

            callback("success", args);

            $("#" + rno + ">button").unbind("click").bind("click", function() {
              $("#" + rno).remove();
              if (typeof me.params.onCancelClick === "function") {
                me.params.onCancelClick();
                ncUploaderIns.deleteFileFromServer();
              }
            });
          }
        }
        $("#" + rno)
          .find(".file_upload_label")
          .addClass("complete")
          .text("File upload Complete");
        tracker().on("ctapEvent", {
          hitName: "cv_upload"
        });
        tracker().on("ctapProfile", {
          hitName: "cv_upload",
          payload: {
            does_cv_exist: true
          }
        });
        tracker().on("event", {
          hitName: `${params.category ||
            "registration"}$cv_upload_success$cv_upload`
        });
      },

      error: function() {
        $("#" + rno)
          .find(".file_upload_label")
          .addClass("error")
          .text("Upload Failed. Close and retry")
          .end()
          .find(".determinate")
          .attr("style", "");
        if (me.params.isRegistration) {
          trackCleverTap("reg_Failed_cv_upload");
        } else if (me.params.isEdit) {
          trackCleverTap("edit_Failed_cv_upload");
        }
      },

      xhr: function() {
        const myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener(
            "progress",
            progressHandlerCreator($("#" + rno + ">.progress")),
            false
          );
        }
        return myXhr;
      },

      complete: function() {
        // executes after error or success
      }
    });
  };

  this.validateBeforeUpload = function(file, fileSize) {
    let isValid = true,
      isExtensionValid = false;
    const callbackArguments = {},
      extensions = params.extensions,
      extension = file.slice(file.lastIndexOf(".") + 1).toLowerCase();

    for (let i = 0; i < extensions.length; ++i) {
      if (extension === extensions[i]) {
        isExtensionValid = true;
        break;
      }
    }
    if (!isExtensionValid) {
      isValid = false;
      callbackArguments.ERROR = {
        dummyFileKey: {
          name: file,
          error: "INVALID_EXTENSION"
        }
      };
    }
    if (typeof fileSize !== "undefined")
      if (fileSize > params.maxSize) {
        isValid = false;
        callbackArguments.ERROR = {
          dummyFileKey: {
            name: file,
            error: "FILE SIZE LIMIT EXCEEDED"
          }
        };
      }

    return {
      isValid: isValid,
      callbackArguments: callbackArguments
    };
  };

  return constructor(this);
};

// ////////////////////////
/*
 * jQuery AjaxQ - AJAX request queueing for jQuery
 *
 * Version: 0.0.1
 * Date: July 22, 2008
 *
 * Copyright (c) 2008 Oleg Podolsky (oleg.podolsky@gmail.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 * http://plugins.jquery.com/project/ajaxq
 * http://code.google.com/p/jquery-ajaxq/
 */

$.ajaxq = function(queue, options) {
  // Initialize storage for request queues if it's not initialized yet
  if (typeof document.ajaxq === "undefined")
    document.ajaxq = {
      q: {},
      r: null
    };

  // Initialize current queue if it's not initialized yet
  if (typeof document.ajaxq.q[queue] === "undefined")
    document.ajaxq.q[queue] = [];

  if (typeof options !== "undefined") {
    // Request settings are given, enqueue the new request
    // Copy the original options, because options.complete is going to be overridden

    const optionsCopy = {};
    for (const o in options) optionsCopy[o] = options[o];
    options = optionsCopy;

    // Override the original callback

    const originalCompleteCallback = options.complete;

    options.complete = function(request, status) {
      // Dequeue the current request
      // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
      document.ajaxq.q[queue].shift();
      document.ajaxq.r = null;

      // Run the original callback
      if (originalCompleteCallback) originalCompleteCallback(request, status);

      // Run the next request from the queue
      // if (document.ajaxq.q[queue] !== null) { //added by @shubhamsethi
      if (document.ajaxq.q[queue].length > 0)
        document.ajaxq.r = $.ajax(document.ajaxq.q[queue][0]);
      // }
    };
    // Enqueue the request
    // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
    document.ajaxq.q[queue].push(options);

    // Also, if no request is currently running, start it
    // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
    if (document.ajaxq.q[queue].length === 1)
      document.ajaxq.r = $.ajax(options);
  } else {
    // No request settings are given, stop current request and clear the queue
    if (document.ajaxq.r) {
      document.ajaxq.r.abort();
      document.ajaxq.r = null;
    }

    document.ajaxq.q[queue] = [];
  }
};
