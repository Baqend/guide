var options, url, oldURL;
var emptyOptions = '?bqoptimize=1;';
var sizeRaw;

function refreshOptimizedImage(providedOptions) {
  updateParameters(providedOptions);
  getImageInfo(true);

  document.getElementById("options").value = options;
  document.getElementById("image").src = url + options;
}

function getType(fastlyHeader, isOptimized) {
  if (typeof fastlyHeader !== "string") {
    return " ";
  }

  var value = fastlyHeader.match(new RegExp("(" + (isOptimized ? "ofmt" : "ifmt") + "=)([^\\s]+)"));
  return value[2];
}

function getSize(fastlyHeader, isOptimized) {
  if (typeof fastlyHeader !== "string") {
    return " ";
  }

  var value = fastlyHeader.match(new RegExp("(" + (isOptimized ? "ofsz" : "ifsz") + "=)([^\\s]+)"));

  var size = Number(value[2]) / 1000;
  if (isOptimized) {
    if (sizeRaw >0) {
      var saving = ("" + (100 * ((sizeRaw - size) / sizeRaw))).replace(/\..*/, "");
      return size + "KB" + (sizeRaw>size? " (" + saving + "% saved)" : "");
    } else {
      return size + "KB";
    }
  } else {
    getImageInfo(true);
    sizeRaw = size;
    return size + "KB";
  }
}

function getDimensions(fastlyHeader, isOptimized) {
  console.log(fastlyHeader);

  if (typeof fastlyHeader !== "string") {
    return " ";
  }
  var value = fastlyHeader.match(new RegExp("(" + (isOptimized ? "odim" : "idim") + "=)([^\\s]+)"));
  return value[2];
}

function getImageInfo(isOptimized) {
  fetch(isOptimized ? url + options : url + "?bqoptimize=1", {method: 'HEAD'}).then((response) => {
    var versionName = isOptimized ? "optimized" : "raw";
    document.getElementById("imageInfo-content-type-" + versionName).innerHTML = getType(response.headers.get("fastly-io-info"), isOptimized);
    document.getElementById("imageInfo-content-length-" + versionName).innerHTML = getSize(response.headers.get("fastly-io-info"), isOptimized);
    document.getElementById("imageInfo-fastly-io-info-" + versionName).innerHTML = getDimensions(response.headers.get("fastly-io-info"), isOptimized);
  });
}

function updateParameters(providedOptions) {
  url = document.getElementById("url").value;
  if (url !== oldURL) {
    oldURL = url;
    getImageInfo(false);
  }
  options = document.getElementById("options").value;
  if (typeof providedOptions === "object") {
    if (!options || options.length === 0) {
      options = emptyOptions;
    }

    for (var option in providedOptions) {
      if (providedOptions.hasOwnProperty(option)) {
        var value = providedOptions[option];
        var stringEncodedOption = value ? ";" + option + "=" + value + ";" : "";

        var idxStart = options.indexOf(option);
        if (idxStart > -1) {
          var idxUntil = options.substring(idxStart).indexOf(";") + 1;
          idxUntil = idxUntil > 0 ? idxUntil : options.substring(idxStart).indexOf("&") + 1;
          idxUntil = idxUntil > 0 ? idxStart + idxUntil : options.length;
          options = options.substring(0, idxStart) + stringEncodedOption + options.substring(idxUntil, options.length)
        } else {
          options = options + stringEncodedOption;
        }
        options = options.replace(";;", ";");
      }
    }
  } else if (typeof providedOptions === "string") {
    options = providedOptions;
  }

  if (options === emptyOptions) {
    options = "";
  }

  if (url && url.toLowerCase().indexOf('app.baqend.com') < 0) {
    document.getElementById("warning").classList.add("image-optimization-warning-visible");
  } else {
    document.getElementById("warning").classList.remove("image-optimization-warning-visible");
  }
}

function refreshOptimizedImageDelayed() {
  debounce(refreshOptimizedImage, 100)();
};

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


document.getElementById("url").value = "https://io-sandbox.app.baqend.com/baqend.png";
refreshOptimizedImage({"width": 800, "height": undefined});
