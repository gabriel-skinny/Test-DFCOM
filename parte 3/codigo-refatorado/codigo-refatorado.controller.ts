import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ClientSession } from "mongoose";
import { Product } from "./product.model";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<string> {
    const { title, description, price, category } = createProductDto;

    if (!title || !price) {
      throw new BadRequestException("Title and Price are required");
    }

    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const newProduct = new this.productModel({
        title,
        description,
        price,
        category,
      });

      const result = await newProduct.save({ session });
      await session.commitTransaction();
      return result.id as string;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException("Failed to create product");
    } finally {
      session.endSession();
    }
  }

  async getProducts(filters?: any): Promise<Product[]> {
    const { category, minPrice, maxPrice } = filters || {};
    const query = this.productModel.find();

    if (category) {
      query.where("category").equals(category);
    }

    if (minPrice !== undefined) {
      query.where("price").gte(minPrice);
    }

    if (maxPrice !== undefined) {
      query.where("price").lte(maxPrice);
    }

    const products = await query
      .select("title description price category")
      .exec();

    if (products.length === 0) {
      throw new NotFoundException("No products found with the given criteria");
    }

    return products;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.findProduct(productId);
    return product;
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto
  ): Promise<void> {
    const { title, description, price, category } = updateProductDto;

    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const updatedProduct = await this.findProduct(productId, session);
      if (title) updatedProduct.title = title;
      if (description) updatedProduct.description = description;
      if (price) updatedProduct.price = price;
      if (category) updatedProduct.category = category;

      await updatedProduct.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException("Failed to update product");
    } finally {
      session.endSession();
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const session: ClientSession = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const result = await this.productModel
        .deleteOne({ _id: productId }, { session })
        .exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException("Could not find product.");
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException("Failed to delete product");
    } finally {
      session.endSession();
    }
  }

  private async findProduct(
    id: string,
    session?: ClientSession
  ): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).session(session).exec();
    } catch (error) {
      throw new NotFoundException("Could not find product.");
    }
    if (!product) {
      throw new NotFoundException("Could not find product.");
    }
    return product;
  }
}
