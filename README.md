<h1> <div align="center"><img align="center" height="40" src="resource/doc/logo.svg"/>picStitch</div></h1>

<p align="center">picStitch 是一款小巧易用的长图拼接 Web App</p>

* Web APP: [picStitch](https://ps.hozen.site)
* 微信小程序: picStitch (🚧开发中)

🔐 picStitch 没有后台服务器，加载完毕后离线可用.  不必担心数据安全和隐私问题.

picStitch 是为了解决手机系统图库不支持图片拼接，以及部分手机不支持长截屏 (例如 iPhone，截止到 2023.9.2).  同时第三方拼图软件过于臃肿或者广告较多的问题.

picStitch 通过对图片的排序、拼接和裁剪图片连接处应用于以下场景：

#### 多图拼接

<p align="center">
<img width="300px" src="./resource/doc/userCase1.jpg">
</p>

#### 长截屏拼接

<p align="center">
<img width="300px" src="resource/doc/userCase2.jpg">
</p>

通过裁剪图片的边界使截屏完美拼接

#### 影视台词拼接

<p align="center">
<img width="300px" src="resource/doc/userCase3.jpg">
</p>

### 使用演示

<p align="center">
<img align="center" width="150px" src="resource/doc/userCase1.gif">
<img align="center" width="150px" src="resource/doc/userCase2.gif">
<img align="center" width="150px" src="resource/doc/userCase3.gif">
</p>

~~为了最大限度的保证图片质量，拼接过程中不会对图片进行任何压缩. 保存时也尽可能保持最大的尺寸，因此在处理超大图片时可能会略有卡顿.~~

为了保证处理超高分辨率图片时的性能，默认对图片进行压缩。
