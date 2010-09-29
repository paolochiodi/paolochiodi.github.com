(function($) {

    var id_canvas = 'cvMain';
    var id_container = 'd_container';
    var id_header = 'd_h1';
    var id_footer = 'd_f';

    var bordo_header = 2;
    var bordo_footer = 1;
    var bordo_layer = 1;

    var h, w;
    var nlayer = 0;

    var path_width = 2;
    var path_color = '#0000ff';

    //prepara le dimensione della canvas e del container
    function initialize_canvas() {

        var main = document.getElementById(id_canvas),
            size = utility.windowSize(),
            canv = $('#' + id_canvas),
            container = $('#' + id_container);

        w = $('#d_container').width()
        main.width = w;
        canv.css('position', 'absolute');        
        h = size.height - canv.offset().top - $('nav.footer').height();
        container.height(h);
        main.height = h;
    }


    //gestione canvas

    //pulisce la canvas "di brutta"
    function clear_canvas() {
        var main = document.getElementById(id_canvas);
        var ctx = main.getContext('2d');
        ctx.clearRect(0, 0, w, h);
    }


    //gestione layers

    //mouse sopra il layer
    function layer_hover_on() {
        $(this).addClass('layer_hover');
        $(this).data('z', $(this).css('z-index'));
        $(this).css('z-index', nlayer + 1000);
    }

    //mouse fuori dal layer
    function layer_hover_out() {
        $(this).removeClass('layer_hover');
        $(this).css('z-index', $(this).data('z'));
    }

    //crea un layer data la posizione e l'oggetto che deve contenere
    function create_layer(x, y, obj) {

        $('<div id="layer' + nlayer + '" />')
            .css('position', 'absolute')
            .css('top', y + 'px')
            .css('left', x + 'px')
            .css('z-index', nlayer)
            .addClass('layer')
            .appendTo('#' + id_container)
            .draggable(
                {
                    scroll: false,
                    containment: '#' + id_container,
                    cancel: '.layer .close'
                }
            )
            .hover(layer_hover_on, layer_hover_out)
            .append(
                obj
            )
            .append(
                $('<a class="close" href="#"></a>').click(
                    function(e) {
                        $(this).parent().remove();
                        e.preventDefault();
                        return false;
                    }
                )
            );

        nlayer++;

        return (nlayer - 1);
    }

    //crea un layer contenente una path
    function create_path_layer(path) {

        var min_x = w;
        var min_y = h;
        var max_x = 0;
        var max_y = 0;

        for (var i = 0; i < path.points.length; i++) {

            var cur_x = path.points[i].x;
            var cur_y = path.points[i].y;

            var cur_x1 = path.points[i].x;
            var cur_y1 = path.points[i].y;

            min_x = Math.min(cur_x, min_x);
            min_y = Math.min(cur_y, min_y);

            max_x = Math.max(cur_x1, max_x);
            max_y = Math.max(cur_y1, max_y);
        }

        min_x -= path.width;
        max_x += path.width;

        min_y -= path.width;
        max_y += path.width;

        var y = min_y - bordo_layer;//($('#' + id_header).height() + bordo_header - bordo_layer + min_y);
        var x = (min_x - bordo_layer);
        var width = (max_x - min_x);
        var height = (max_y - min_y);

        var layer = document.createElement('canvas');
        layer.height = height;
        layer.width = width;

        var this_layer =
            create_layer(
                            x,
                            y,
                            layer
                        );

        if ('G_vmlCanvasManager' in window)
            G_vmlCanvasManager.initElement(layer);

        var ctx = layer.getContext('2d');

        for (var j = 1; j < path.points.length; j++) {
            var cur = path.points[j];
            var prev = path.points[j - 1];

            ctx.strokeStyle = path.color;
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.lineWidth = path.width;
            ctx.beginPath();
            ctx.moveTo(prev.x - min_x, prev.y - min_y);
            ctx.lineTo(cur.x - min_x, cur.y - min_y);
            ctx.stroke();
        }

        clear_canvas();
        tool_stencil();
    }

    //crea un layer contenente testo
    function create_text_layer(text) {

        if (utility.trim(text.val()) != "") {
            var pos = text.position();

            create_layer(
                    pos.left,
                    pos.top,
                    $('<div />')
                        .text(text.val())
                        .css('font-size', $('#fontSize').val())
                        .css('font-family', $('#fontFamily').val())
                        .css('color', path_color)
                    );

            $('#' + id_canvas)
                .css('cursor', 'text');
        }
        text.remove();
    }

    //gestione strumenti

    //funzioni iniziali comuni eseguite quando cambio lo strumento
    function change_tool_common() {

        $('#' + id_container + ' textarea').each(function() {
            create_text_layer($(this));
        });

        $('#fontFamily, #fontSize')
            .unbind();

        $('#color')
            .unbind('colorchosen');

        $('#' + id_canvas)
            .unbind()
            .hide();

        $('.tools')
            .hide();

        $('#' + id_header + ' a').removeClass('selected');
    }

    //strumento matita
    function tool_stencil() {

        change_tool_common();

        $('#' + id_canvas)
            .show()
            .css('z-index', 99)
            .css('cursor', 'default');

        $('#t_width,#t_color')
            .show();

        $('#matita').addClass('selected');

        var editing = false;
        var path = { width: path_width, color: path_color, points: [] };

        $('#' + id_canvas)
            .mousedown(function(e) {

                editing = true;

                var main = document.getElementById(id_canvas);
                var ctx = main.getContext('2d');

                var of = $('#' + id_canvas).offset();

                var x = e.pageX - of.left;
                var y = e.pageY - of.top;

                path.width = path_width;
                path.color = path_color;
                path.points.push({ x: x, y: y });

            })
            .mouseup(function(e) {
                if (editing) {
                    editing = false;

                    //create layer
                    create_path_layer(path);
                }
            })
            .mousemove(function(e) {
                if (editing) {

                    var main = document.getElementById(id_canvas);
                    var ctx = main.getContext('2d');

                    var of = $('#' + id_canvas).offset();

                    var x = e.pageX - of.left;
                    var y = e.pageY - of.top;

                    var prev = path.points[path.points.length - 1];

                    path.points.push({ x: x, y: y });

                    //disegna
                    ctx.strokeStyle = path.color;
                    ctx.lineJoin = ctx.lineCap = 'round';
                    ctx.lineWidth = path.width;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            });
    }

    //strumento testo
    function tool_text() {

        change_tool_common();

        $('#' + id_canvas)
            .show()
            .css('z-index', 99)
            .css('cursor', 'text');

        $('#t_font,#t_color')
            .show();

        $('#testo').addClass('selected');

        var font_size = $('#fontSize').val();
        var font_family = $('#fontFamily').val();

        $('#color').bind('colorchosen', function() {
            if(text){
              text.css('color', path_color);
              text[0].focus();
            }
        })

        $('#fontSize').change(function() {
            font_size = $(this).val();

            if (text) {
                text.css('font-size', font_size);
                text[0].focus();
            }
        });

        $('#fontFamily').change(function() {
            font_family = $(this).val();

            if (text) {
                text.css('font-family', font_family);
                text[0].focus();
            }
        });

        var text;

        $('#' + id_canvas)
            .click(function(e) {

                if (!text) {
                    
                    var of = $('#' + id_container).offset(),
                        x = e.pageX - of.left,
                        y = e.pageY - of.top;

                    text = $('<textarea />')
                        .addClass('l_text')
                        .css('top', y + 'px')
                        .css('left', x + 'px')
                        .css('z-index', 100)
                        .css('font-size', font_size)
                        .css('font-family', font_family)
                        .css('color', path_color)
                        .appendTo('#' + id_container);

                    $('#' + id_canvas)
                        .css('cursor', 'default');

                    text[0].focus();
                }
                else {
                    create_text_layer(text);
                    text = null;
                }

                e.preventDefault();
                return false;
            })
    }

    //strumento gomma / cancellino
    function tool_rubber() {

        change_tool_common();

        var editing = false;

        $('#' + id_canvas)
            .show()
            .css('z-index', 99)
            .css('cursor', 'default'); ;

        $('#t_width')
            .show();

        $('#gomma').addClass('selected');

        $('#' + id_canvas)
            .mousedown(function(e) {
                editing = true;
                rubber_layers(e);
            })
            .mouseup(function(e) {
                if (editing) {
                    editing = false;
                }
            })
            .mousemove(function(e) {
                if (editing)
                    rubber_layers(e);
            });

        //"disegna" la gomma
        function rubber_layers(e) {
            var current_width = (path_width * 3);

            var y = (e.pageY - (current_width / 2));
            var x = (e.pageX - (current_width / 2));

            var x1 = (x + current_width);
            var y1 = (y + current_width);

            $('.layer').each(function() {
                if (this.firstChild.getContext) {

                    var p = $(this).offset();
                    p.x = p.left;
                    p.y = p.top;
                    p.x1 = p.x + $(this).width();
                    p.y1 = p.y + $(this).height();

                    if (((x > p.x) && (x < p.x1) || (x < p.x) && (x1 > p.x)) &&
                            ((y > p.y) && (y < p.y1) || (y < p.y) && (y1 > p.y))) {

                        var ctx = this.firstChild.getContext('2d');
                        //problema noto di excanvas
                        ctx.clearRect(x - p.x, y - p.y, current_width, current_width);
                    }
                }
            })
        }
    }

    function tool_clear() {
        change_tool_common();

        clear_canvas();

        $('.layer').remove();

        tool_stencil();
    }

    function tool_select() {

        change_tool_common();

        $('#' + id_canvas)
            .css('cursor', 'default');

        $('#select').addClass('selected');
    }

    //funzioni inizializzazione

    $(document).ready(function() {

        initialize_canvas();

        //preapara header

        $('#matita').click(function(e) {
            tool_stencil();
            e.preventDefault();
            return false;
        });

        $('#select').click(function(e) {
            tool_select();
            e.preventDefault();
            return false;
        });

        $('#testo').click(function(e) {
            tool_text();
            e.preventDefault();
            return false;
        });

        $('#pulisci').click(function(e) {
            tool_clear();
            e.preventDefault();
            return false;
        });

        $('#gomma').click(function(e) {
            tool_rubber();
            e.preventDefault();
            return false;
        });

        //prepara footer

        $('#width1').click(function(e) {
            $('#t_width a.selected').removeClass('selected');
            $('#width1').addClass('selected');
            path_width = 2;
            e.preventDefault();
            return false;
        });

        $('#width2').click(function(e) {
            $('#t_width a.selected').removeClass('selected');
            $('#width2').addClass('selected');
            path_width = 4;
            e.preventDefault();
            return false;
        });


        $('#width3').click(function(e) {
            $('#t_width a.selected').removeClass('selected');
            $('#width3').addClass('selected');
            path_width = 8;
            e.preventDefault();
            return false;
        });


        $('#width4').click(function(e) {
            $('#t_width a.selected').removeClass('selected');
            $('#width4').addClass('selected');
            path_width = 12;
            e.preventDefault();
            return false;
        });

        $('#width5').click(function(e) {
            $('#t_width a.selected').removeClass('selected');
            $('#width5').addClass('selected');
            path_width = 16;
            e.preventDefault();
            return false;
        });

        var color_picker =
            $('<div />')
                .hide()
                .appendTo('body')
                .farbtastic(function(color) {
                    path_color = color;
                    $('#color').css('background-color', color);
                    $('#color').trigger('colorchosen')
                });

        $.farbtastic(color_picker).setColor(path_color);
        $('#color').css('background-color', $.farbtastic(color_picker).color);

        $('#color').click(function(e) {

            var y = $('#' + id_footer).height() + 5;
            var x = $('#color').position().left;

            color_picker.css('position', 'absolute')
                .css('z-index', '100')
                .css('bottom', y + 'px')
                .css('left', x + 'px')
                .show();

            function hide(e) {
                if (!utility.isChildOf(color_picker[0], e.target, color_picker[0])) {
                    color_picker.hide();
                    $(document).unbind('mousedown', hide);
                    path_color = $.farbtastic(color_picker).color;
                    $('#color').css('background-color', path_color);
                    $('#color').trigger('colorchosen')
                }
            }

            $(document).bind('mousedown', hide);

            e.preventDefault();
            return false;
        });

        $('#width1').addClass('selected');

        tool_stencil();
    });

    $(window).resize(function() {
        initialize_canvas();
    });

})(jQuery);