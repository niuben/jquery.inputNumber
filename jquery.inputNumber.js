/**
 * @author Nikolay Kostyurin <jilizart@gmail.com>
 *     HTML5 Like enumerable input
 */
(function($){
    "use strict";

    var InputNumber = function(options, $el) {
        this.$el = $el;
        this.options = $.extend( {}, this.defaults, options );
        this.init();
    };

    InputNumber.prototype = {

        $el: null, // input element
        $wrap: null, //div wrapper element

        handle: null, //timer handle

        options: null,
        defaults: {
            negative: true,
            positive: true,
            wrapClass: 'ranged-input',
            upClass: 'up',
            upTitle: 'Incrase',
            downClass: 'down',
            downTitle: 'Decrace'
        },

        init: function() {
            var opts = this.options;
            
            this.$el.wrap($('<div />', {'class':opts.wrapClass}));
            this.$el.after(
                $('<a />', {'class':opts.upClass, 'title':opts.upTitle}),
                $('<a />', {'class':opts.downClass, 'title':opts.downTitle})
            );
            this.$wrap = this.$el.parent('.'+opts.wrapClass);

            this.bindEvents();
        },

        bindEvents:function() {
            var opts = this.options,
                self = this;

            this.$wrap
            .delegate('a.'+opts.downClass,'mousedown',function(e){
                self.reduce(e);
                self.handle = setInterval(function(){
                    self.reduce(e);
                }, 200);
            })
            .delegate('a.'+opts.downClass,'mouseup',function(e){
                clearInterval(self.handle);
            })
            .delegate('a.'+opts.upClass,'mousedown',function(e){
                self.add(e);
                self.handle = setInterval(function(){
                    self.add(e);
                }, 200);
            })
            .delegate('a.'+opts.upClass, 'mouseup', function(e){
                clearInterval(self.handle);
            });
            ;

            this.$el
            .on('change',function(e){
                var $this = $(this),
                    val = $this.val();

               if(val == '') $this.val(0);
            })
            .bind('mousewheel', function(e, delta) {
                var defVal = parseInt(self.$el.val()) || 0,
                    curVal = defVal+delta;

                if(!opts.negative) {
                    if(curVal >= 0) self.$el.val(curVal);
                } else if(!opts.positive) {
                    if(curVal <= 0) self.$el.val(curVal);
                } else {
                    self.$el.val(curVal);
                }
                    
            });

        },
        reduce: function(e){
            var opts = this.options;
            var defVal = parseInt(this.$el.val()) || 0,
            curVal = --defVal;

            if(!opts.negative) {
                if(curVal >= 0) this.$el.val(curVal);
            } else {
                this.$el.val(curVal);
            }                
            e.preventDefault();
        },
        add: function(e){
            var opts = this.options;
            var defVal = parseInt(this.$el.val()) || 0,
            curVal = ++defVal;

                console.log(curVal);

            if(!opts.positive) {
                if(curVal <= 0) this.$el.val(curVal);
            } else {
                this.$el.val(curVal);
            }
                
            e.preventDefault();

        }


    };

    $.fn.inputNumber = function(options) {

        $(this).each(function(){
            var number = new InputNumber(options, $(this));
        });

    };

})(jQuery);
