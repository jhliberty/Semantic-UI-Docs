/*  ******************************
  Card
  Author: Jack Lukic
  Notes: First Commit June 13, 2013

  Quirky Cards
******************************  */

;(function ($, window, document, undefined) {

$.fn.card = function(parameters) {
  var
    $allModules     = $(this),
    
    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.fn.card.settings, parameters)
      : $.fn.card.settings,

    eventNamespace  = '.' + settings.namespace,
    moduleNamespace = 'module-' + settings.namespace,
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),
    invokedResponse,
    allModules
  ;
  $allModules
    .each(function() {
      var
        $module   = $(this),
        $overlay    = $module.find(settings.selector.overlay),

        selector      = $module.selector || '',
        element       = this,
        instance      = $module.data('module-' + settings.namespace),
        
        className     = settings.className,
        metadata      = settings.metadata,
        namespace     = settings.namespace,
        animation     = settings.animation,
        
        errors        = settings.errors,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing card with bound events', $module);
          $module
            .dimmer({
              on       : 'hover',
              closable : false
            })
          ;
          $module
            .data('module', module)
          ;
        },

        destroy: function() {
          module.debug('Destroying previous card for', $module);
          $module
            .off(namespace)
          ;
        },

        event: {

          mouseenter: function() {
            
          },

          mouseleave: function() {

          }

        },

        get: {
          progress: function() {

          },
          votes: function() {

          }
        },
        set: {
          progress: function() {

          },
          votes: function(count) {
            if(count == 'increase') {

            }
          }
        },

        vote: function() {

        },

        
        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, settings, name);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          module.debug('Changing internal', name, value);
          if(value !== undefined) {
            if( $.isPlainObject(name) ) {
              $.extend(true, module, name);
            }
            else {
              module[name] = value;
            }
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.moduleName + ':');
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.moduleName + ':');
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.log, console, settings.moduleName + ':');
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime,
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Element'        : element,
                'Name'           : message[0],
                'Arguments'      : message[1] || '',
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.moduleName + ':',
              totalTime = 0
            ;
            time        = false;
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            maxDepth,
            found
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && instance !== undefined) {
            query    = query.split('.');
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              if( $.isPlainObject( instance[value] ) && (depth != maxDepth) ) {
                instance = instance[value];
                return true;
              }
              else if( instance[value] !== undefined ) {
                found = instance[value];
                return true;
              }
              module.error(errors.method);
              return false;
            });
          }
          if ( $.isFunction( found ) ) {
            instance.verbose('Executing invoked function', found);
            return found.apply(context, passedArguments);
          }
          return found || false;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        invokedResponse = module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          module.destroy();
        }
        module.initialize();
      }
    })
  ;
  return (invokedResponse)
    ? invokedResponse
    : this
  ;
};

$.fn.card.settings = {
  moduleName  : 'Card',

  debug       : true,
  verbose     : true,
  performance : false,
  
  exclusive   : true,
  collapsible : true,
  
  onVote      : function(){},

  errors: {
    method    : 'The method you called is not defined'
  },

  className   : {
    active    : 'active',
    hover     : 'hover'
  },

  selector    : {
    title     : '.title',
    icon      : '.icon',
    content   : '.content'
  },

};

})( jQuery, window , document );