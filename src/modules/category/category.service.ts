import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {
    public constructor(
        private readonly prismaService: PrismaService,
    ) {}

    // In general, here we can add infinity scrolling, like it realised in the streamService, 
    // but for now we will just return all categories, because we have lesser amount of categories 
    // than streams, and we don't need to paginate them for now
    public async findAll() {
        const categories = await this.prismaService.category.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        })
        return categories
    }

    public async findRandom() {
		const total = await this.prismaService.category.count()

		const randomIndexes = new Set<number>()

		while (randomIndexes.size < 7) {
			const randomIndex = Math.floor(Math.random() * total)

			randomIndexes.add(randomIndex)
		}

		const categories = await this.prismaService.category.findMany({
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			},
			take: total,
			skip: 0
		})

		return Array.from(randomIndexes).map(index => categories[index])
	}

    public async findBySlug(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: {
				slug
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}
}
