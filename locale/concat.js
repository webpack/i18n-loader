require = require("enhanced-require")(module);

module.exports = function() {
	var loaderSign = this.request.indexOf("!");
	var req = this.request.substr(loaderSign+1);
	var match = /^(.*)[\/\\]([^\.\/\\]+)\.([^\/\\!]+)$/.exec(req);
	var path = match[1];
	var locale = match[2].split("-");
	var filename = match[3];
	var result = [];
	var cb = this.async() || this.callback;
	var context = this;
	function next(i) {
		if(i <= locale.length) {
			var request = path + "/" + (i == 0 ? "" : locale.slice(0, i).join("-") + ".") + filename;
			context.resolve(context.context, request, function(err, resolveRequest) {
				if(err) return cb(err);
				var part = require("raw!"+resolveRequest);
				result.push(part);
				next(i+1);
			});
		} else {
			cb(null, result.join("\n\n"));
		}
	}
	next(0);
}