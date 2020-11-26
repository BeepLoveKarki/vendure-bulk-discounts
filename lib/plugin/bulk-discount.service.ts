import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, In } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { ID, assertFound, Product, ProductVariant, TransactionalConnection, Ctx, RequestContext } from "@vendure/core";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { BulkDiscount } from "./bulk-discount.entity";
import { BulkDiscountInput } from "./index";

@Injectable()
export class BulkDiscountService {
  constructor(private connection: TransactionalConnection) {}

  findAll(
    ctx: any,
    options: FindManyOptions<BulkDiscount> | undefined
  ): Promise<BulkDiscount[]> {
    return this.connection.getRepository(ctx,BulkDiscount).find(options);
  }

  findByProductVariantSku(ctx: any,productVariantSku: string): Promise<BulkDiscount[]> {
    return this.connection
      .getRepository(ctx,BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.sku = :sku", { sku: productVariantSku })
      .getMany();
  }

  findByProductVariantId(ctx: any,productVariantId: ID): Promise<BulkDiscount[]> { 
	
	return this.connection
      .getRepository(ctx,BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.id = :productVariantId", { productVariantId })
      .getMany();
	
  }

  findByProductId(ctx: any,productId: ID): Promise<BulkDiscount[]> {
    return this.connection
      .getRepository(ctx,BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.productId = :productId", { productId })
      .getMany();
  }

  async findProductVariantIdBySku(ctx: any,sku: string): Promise<ID> {
	
    return assertFound(
        this.connection.getRepository(ctx,ProductVariant).findOne({ where: { sku } })
    ).then((v) => {
      return v.id;
    });
  }

  findOne(ctx: any,recommendationId: ID): Promise<BulkDiscount | undefined> {
    return this.connection
      .getRepository(ctx,BulkDiscount)
      .findOne(recommendationId, { loadEagerRelations: true });
  }

  async create(ctx: any,input: BulkDiscountInput): Promise<BulkDiscount[]> {
    const discounts = [];

    for (const d of input.discounts) {
      const discount = new BulkDiscount({
        productVariant: await this.connection
          .getRepository(ctx,ProductVariant)
          .findOne(input.productVariantId),
        quantity: d.quantity,
        price: d.price,
      });

      discounts.push(
        assertFound(this.connection.getRepository(ctx,BulkDiscount).save(discount))
      );
    }

    return Promise.all(discounts);
  }

  async update(ctx: any, id: number, quantity: number, price: number) {
    return this.connection
      .getRepository(ctx,BulkDiscount)
      .update({ id }, { quantity, price });
  }

  async delete(ctx: any,ids: any[]): Promise<DeletionResponse> {
    try {
	
	   await this.connection.getRepository(ctx,BulkDiscount).delete(ids);

      return {
        result: DeletionResult.DELETED,
      };
    } catch (e) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
}
