export default ['number', function ($number) {
    return {
        attrs: {
            x: $number()(true),
            y: $number()(true),
            width: $number()(true),
            index: $number()
        },
        link: function (painter, attr) {

            let x = attr.x;
            let y = attr.y;
            let width = attr.width;
            let height = 50 + this.pkgs.length * 20;

            // 校对
            if (x + width > this._width) x -= width;
            if (y + height > this._height) y -= height;

            // 绘制背景
            painter.config('fillStyle', '#ffffff').fillRect(x, y, width, height);

            // 绘制日期
            painter.config({
                fillStyle: 'red',
                'font-size': 20,
                "textAlign": 'left',
                "textBaseline": 'middle',
            }).fillText(this.pkgs[0].time[attr.index], x + 10, y + 20);

            painter.config({
                'font-size': 14
            });

            // 绘制数据
            for (let i = 0; i < this.pkgs.length; i++) {

                // 圆球
                painter.config('fillStyle', this.pkgs[i].color).fillCircle(x + 20, y + 50 + i * 20, 3);

                // 文字
                painter.config('fillStyle', '#000').fillText(this.pkgs[i].package + " : " + this.pkgs[i].value[attr.index], x + 40, y + 50 + i * 20);

            }

        }
    };
}];
