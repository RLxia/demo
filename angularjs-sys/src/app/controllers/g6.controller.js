import G6 from '@antv/g6';
//https://antv.alipay.com/zh-cn/index.html
/*
 * G6 controller
 */
G6Controller.$inject = ['$scope'];

function G6Controller($scope) {
    
    var objData = {
	    "children":[
	        {
	            "children":[

	            ],
	            "name":"test1"
	        },
	        {
	            "children":[

	            ],
	            "name":"test2"
	        },
	        {
	            "children":[

	            ],
	            "name":"test3"
	        },
	        {
	            "children":[
	                {
	                    "children":[

	                    ],
	                    "name":"test4-1"
	                },
	                {
	                    "children":[

	                    ],
	                    "name":"test4-2"
	                },
	                {
	                    "children":[

	                    ],
	                    "name":"test4-3" 
	                },
	                {
	                    "children":[

	                    ],
	                    "name":"test4-4"
	                }
	            ],
	            "name":"test4"
	        },
	        {
	            "children":[
	                {
	                    "children":[

	                    ],
	                    "name":"test5-1"
	                }
	            ],
	            "name":"test5"
	        },
	        {
	            "children":[
	                {
	                    "children":[

	                    ],
	                    "name":"test9-1"
	                }
	            ],
	            "name":"test9"
	        },
	        {
	            "children":[
	                
	            ],
	            "name":"test10"
	        }
	    ],
	    "name":"ALL"
	}

	var Util = G6.Util;
	G6.registNode('iconNode', {   //注册节点
        draw: function(cfg, group){
            console.log(cfg);
            var model = cfg.model;
            var tree1 = require("../../images/tree_01.png");
            var tree2 = require("../../images/tree_02.png");
            var tree3 = require("../../images/tree_03.png");
            var shapeCfg = {
                attrs: {
                    x: cfg.x,
                    y: cfg.y,
                    img: tree1,
                    width:60,
                    height:60,
                },
            };
            if (model.children && model.children.length) {
                shapeCfg.class = model.isCollapsed ? 'spreadoutButton' : 'collapseButton';
                shapeCfg.attrs.img = tree3;
            }
            if (model.root) {
                shapeCfg.attrs.img = tree2;
            }
            shapeCfg.attrStash = Util.mix({}, shapeCfg.attrs);
            return group.addShape('image', shapeCfg);
        },
        afterDraw(cfg, group) {
            var model = cfg.model;
            var align = model.align;
            var xOffset = 75;
            var yOffset = 30;
            var labelAttrs = {
                text: model.name,
                fill: '#666',
                textBaseline: 'middle',
                fontSize: 20,
                x: cfg.x + xOffset,
                y: cfg.y + yOffset,
                textAlign: 'left',
            };
            if (align === 'R') {
                Util.mix(labelAttrs, {
                    x: cfg.x - 15,
                    y: cfg.y + yOffset,
                    textAlign: 'right',
                });
            }
            var label = group.addShape('text', {
                attrs: labelAttrs,
            });
            return label;
        }
    });
    var tree  = new G6.Tree({
        id: 'c1',   //容器ID
        height: 500,                        // 画布高
        //width: window.innerHeight,
        fitView: 'autoZoom', // 自动缩放
        layoutFn: G6.Layout.LayeredTidyTree,  //布局类型
        domFocus:true,
        layoutCfg: {
            getHGap: function(/* d */) { // 横向间距
                return 100;
            },
            getVGap: function(/* d */) { // 竖向间距
                return 10;
            },
        },
    });

    // 加载数据
    tree.source(objData);
    tree.node().shape('iconNode');
    tree.edge().shape('smooth');
        
    // 渲染树图
    tree.render();
}


angular.module('controller')
    .controller("G6Controller", G6Controller);



