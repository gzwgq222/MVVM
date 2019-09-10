class MVVM {
  constructor (options) {
    // 挂在实例上
    this.$el = options.el; 
    this.$data = options.data;
    if (this.$el) {
      new Compile(this.$el, this);
    }
  }
}