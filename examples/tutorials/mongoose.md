---
title: "如何在 Deno 中使用 Mongoose"
description: "使用 Deno 搭配 Mongoose 的分步指南。学习如何设置 MongoDB 连接，创建模式，实施数据模型，并使用 Mongoose 的基于模式建模执行 CRUD 操作。"
url: /examples/mongoose_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mongoose/
  - /runtime/tutorials/how_to_with_npm/mongoose/
---

[Mongoose](https://mongoosejs.com/) 是一个流行的基于模式的库，用于建模 [MongoDB](https://www.mongodb.com/) 的数据。它简化了编写 MongoDB 验证、类型转换和其他相关业务逻辑的过程。

本教程将向您展示如何在 Deno 项目中设置 Mongoose 和 MongoDB。

[查看源代码](https://github.com/denoland/examples/tree/main/with-mongoose) 或
[查看视频指南](https://youtu.be/dmZ9Ih0CR9g)。

## 创建一个 Mongoose 模型

让我们创建一个简单的应用程序，连接到 MongoDB，创建一个 `Dinosaur` 模型，并向数据库添加和更新一个恐龙。

首先，我们将创建必要的文件和目录：

```console
touch main.ts && mkdir model && touch model/Dinosaur.ts
```

在 `/model/Dinosaur.ts` 中，我们将导入 `npm:mongoose`，定义 [模式]，并导出它：

```ts title="model/Dinosaur.ts"
import mongoose, {
  type HydratedDocument,
  type Model,
  model,
  models,
  Schema,
} from "npm:mongoose@latest";

interface Dinosaur {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DinosaurMethods {
  updateDescription(
    this: HydratedDocument<Dinosaur>,
    description: string,
  ): Promise<
    HydratedDocument<Dinosaur>
  >;
}

type DinosaurModel = Model<Dinosaur, {}, DinosaurMethods>;

const dinosaurSchema = new Schema<Dinosaur, DinosaurModel, DinosaurMethods>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

dinosaurSchema.methods.updateDescription = async function (
  this: HydratedDocument<Dinosaur>,
  description: string,
) {
  this.description = description;
  return await this.save();
};

export default (models.Dinosaur as DinosaurModel) ||
  model<Dinosaur, DinosaurModel>("Dinosaur", dinosaurSchema);
```

## 连接到 MongoDB

现在，在我们的 `main.ts` 文件中，我们将导入 mongoose 和 `Dinosaur` 模式，并连接到 MongoDB：

```ts
import mongoose from "npm:mongoose@latest";
import Dinosaur from "./model/Dinosaur.ts";

const MONGODB_URI = Deno.env.get("MONGODB_URI") ??
  "mongodb://localhost:27017/deno_mongoose_tutorial";

await mongoose.connect(MONGODB_URI);

console.log(mongoose.connection.readyState);
```

因为 Deno 支持顶级 `await`，我们能够简单地 `await mongoose.connect()`。

运行代码，我们应该期待得到一个日志 `1`：

```shell
deno run --allow-env --allow-net main.ts
```

## 操作数据

让我们在 `/model/Dinosaur.ts` 中为我们的 `Dinosaur` 模式添加一个实例 [方法](https://mongoosejs.com/docs/guide.html#methods)：

```ts title="model/Dinosaur.ts"
dinosaurSchema.methods.updateDescription = async function (
  this: HydratedDocument<Dinosaur>,
  description: string,
) {
  this.description = description;
  return await this.save();
};

// ...
```

这个实例方法 `updateDescription` 将允许您更新记录的描述。

回到 `main.ts`，让我们开始在 MongoDB 中添加和操作数据。

```ts title="main.ts"
const deno = new Dinosaur({
  name: "Deno",
  description: "有史以来最快的恐龙。",
});

await deno.save();

const denoFromMongoDb = await Dinosaur.findOne({ name: "Deno" }).exec();
if (!denoFromMongoDb) throw new Error("未找到 Deno");
console.log(
  `在 MongoDB 中查找 Deno -- \n  ${denoFromMongoDb.name}: ${denoFromMongoDb.description}`,
);

await denoFromMongoDb.updateDescription(
  "有史以来最快和最安全的恐龙。",
);

const newDenoFromMongoDb = await Dinosaur.findOne({ name: "Deno" }).exec();
if (!newDenoFromMongoDb) throw new Error("更新后未找到 Deno");
console.log(
  `再次查找 Deno -- \n  ${newDenoFromMongoDb.name}: ${newDenoFromMongoDb.description}`,
);
```

运行代码，我们得到：

```console
在 MongoDB 中查找 Deno --
  Deno: 有史以来最快的恐龙。
再次查找 Deno --
  Deno: 有史以来最快和最安全的恐龙。
```

太棒了！🦕 现在你已经拥有了一个完整的 Deno 应用程序，使用 Mongoose 与 MongoDB 交互！

有关使用 Mongoose 的更多信息，请参考
[他们的文档](https://mongoosejs.com/docs/guide.html)。