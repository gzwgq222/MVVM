class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 能获取到元素才开始编译
    if (this.el) {
      // 1.把真实的 dom 移入到内存中 fragment 文档碎片
      let fragment = this.nodeToFragment(this.el);
      // 2.编译 提取元素和文本节点
      this.compile(fragment);
      // 3.把编译好的 fragment 塞回到真实的 dom 中
    }
  }
  /* 辅助方法 */
  // 是否为元素节点
  isElementNode (node) {
    return node.nodeType === 1;
  }
  // 是不是指令
  isDirective (attrName) {
    return attrName.includes('v-');
  }
  /* 核心方法 */
  // 文档碎片存储 dom 节点
  nodeToFragment (el) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    };
    console.log(fragment);
    return fragment;
  }
  compileElement(node) {
    let attrs = node.attributes;
    console.log(attrs);
    [...attrs].forEach(attr => {
      const attrName = attr.name;
      if (this.isDirective(attrName)) {
        console.log('v-', attr.name);
      }
      console.log(attr, attr.name);
    })
  }
  compileText(node) {

  }
  compile (fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        console.log('元素节点：', node);
        this.compileElement(node);
        this.compile(node); // 严格模式下 arguments.callee 会报错
      } else {
        this.compileText(node);
        console.log('text: ', node);
      }
    })
  }
} 