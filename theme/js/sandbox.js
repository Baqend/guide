var options, url;
var emptyOptions = '?bqoptimize=1;';

function refreshOptimizedImage(providedOptions) {
  url = document.getElementById("url").value;
  options = document.getElementById("options").value;
  if (typeof providedOptions === "object") {
    if (!options || options.length === 0) {
      options = emptyOptions;
    }

    for (var option in providedOptions) {
      if (providedOptions.hasOwnProperty(option)) {
        var value = providedOptions[option];
        var stringEncodedOption = value ? option + "=" + value + ";" : "";

        var idxStart = options.indexOf(option);
        if (idxStart > -1) {
          var idxUntil = options.substring(idxStart).indexOf(";")+1;
          idxUntil = idxUntil > 0 ? idxUntil : options.substring(idxStart).indexOf("&")+1;
          idxUntil = idxUntil > 0 ? idxStart + idxUntil: options.length;
          options = options.substring(0, idxStart) + stringEncodedOption + options.substring(idxUntil, options.length)
        } else {
          options = options + stringEncodedOption;
        }
      }
    }
  } else if (typeof providedOptions === "string") {
    options = providedOptions;
  }

  if (options === emptyOptions) {
    options = "";
  }

  document.getElementById("options").value = options;
  document.getElementById("image").src = url + options;

  if (url && url.toLowerCase().indexOf('app.baqend.com')<0) {
    document.getElementById("warning").classList.add("image-optimization-warning-visible");
  } else {
    document.getElementById("warning").classList.remove("image-optimization-warning-visible");
  }
};

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


document.getElementById("url").value = "https://ksm.app.baqend.com/v1/file/www/%2Bimg/flyingq-hd-opt.png";
refreshOptimizedImage({"width":800,"height":undefined});
