// Generated by CoffeeScript 1.3.3

/*
Knockout Meteor plugin v0.1
(c) 2012 Steven Luscher, Ruboss - http://ruboss.com/
License: MIT (http://www.opensource.org/licenses/mit-license.php)

Create Knockout Observables from queries against Meteor Collections.
When the results of those queries change, knockout.meteor.js will
ensure that the Observables are updated.

http://github.com/steveluscher/knockout.meteor
*/


(function() {
  var apply_defaults, apply_transform, meteor, sync;

  meteor = {
    find: function(collection, selector, options) {
      var data_func, meteor_cursor;
      if (options == null) {
        options = {};
      }
      apply_defaults(options);
      meteor_cursor = collection.find(selector, options.meteor_options);
      data_func = function() {
        var data;
        meteor_cursor.rewind();
        data = meteor_cursor.fetch();
        return apply_transform(data, options);
      };
      return sync({}, data_func, options.mapping);
    },
    findOne: function(collection, selector, options) {
      var data_func;
      if (options == null) {
        options = {};
      }
      apply_defaults(options);
      data_func = function() {
        var data;
        data = collection.findOne(selector, options.meteor_options);
        return apply_transform(data, options);
      };
      return sync({}, data_func, options.mapping);
    }
  };

  apply_defaults = function(options) {
    _.defaults(options, {
      mapping: {},
      view_model: null
    });
    _.defaults(options.mapping, {
      key: function(item) {
        return ko.utils.unwrapObservable(item._id);
      },
      copy: []
    });
    if (options.mapping.copy && _.isArray(options.mapping.copy)) {
      options.mapping.copy = _.union(options.mapping.copy, ['_id']);
    }
    if (_.isFunction(options.view_model)) {
      return options.mapping.create = function(opts) {
        var view_model;
        view_model = new options.view_model();
        return ko.mapping.fromJS(opts.data, options.mapping, view_model);
      };
    }
  };

  apply_transform = function(data, options) {
    if (options.transform) {
      return options.transform(data);
    } else {
      return data;
    }
  };

  sync = function(target, data_func, mapping) {
    var ctx,
      _this = this;
    ctx = new Meteor.deps.Context();
    ctx.on_invalidate(function() {
      return sync(target, data_func, mapping);
    });
    return ctx.run(function() {
      var data;
      data = data_func();
      if (target && target.__ko_mapping__) {
        if (_.isUndefined(ko.utils.unwrapObservable(target))) {
          return target(ko.mapping.fromJS(data, mapping));
        } else {
          return ko.mapping.fromJS(data, target);
        }
      } else {
        return target = ko.mapping.fromJS(data, mapping);
      }
    });
  };

  ko.exportSymbol('meteor', meteor);

}).call(this);