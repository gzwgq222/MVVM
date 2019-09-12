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
      this.el.appendChild(fragment);
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
    // console.log(fragment);
    return fragment;
  }
  compileElement(node) {
    let attrs = node.attributes;
    [...attrs].forEach(attr => {
      const attrName = attr.name;
      if (this.isDirective(attrName)) {
        const expr = attr.value;
        const [, type] = attrName.split('-');
        CompileUtil[type](node, this.vm, expr);
        // console.log('v-', attrName, attr.value);
      }
    })
  }
  // 文本
  compileText(node) {
    const expr = node.textContent;
    const reg = /\{\{([^}]+)\}\}/g;
    if (reg.test(expr)) {
      CompileUtil['text'](node, this.vm, expr);
    }
  }
  compile (fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        // console.log('元素节点：', node);
        this.compileElement(node);
        this.compile(node); // 严格模式下 arguments.callee 会报错
      } else {
        this.compileText(node);
      }
    })
  }
} 

CompileUtil = {
  // 获取变量值
  getVal (vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  },
  // 获取 {{ }} 中的变量
  getTextValue (vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      return this.getVal(vm, arguments[1].trim())
    })
  },
  text (node, vm, expr) {
    const updateFn = this.updater['textUpdater'];
    const value = this.getTextValue(vm, expr);
    updateFn && updateFn(node, value);

  },
  model (node, vm, expr) {
    const updateFn = this.updater['modelUpdater'];
    updateFn && updateFn(node, this.getVal(vm, expr));
  },
  updater: {
    textUpdater (node, value) {
      node.textContent = value;
    },
    modelUpdater (node, value) {
      node.removeAttribute('v-model');
      node.value = value;
    }
  }
}