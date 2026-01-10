import reviewsData from "../../db_json/reviews.json"  with { type: "json" };
import usersData from "../../db_json/users.json"  with { type: "json" };

/** Lấy review theo productId + join user */
export async function getReviewsByProductId(productId) {
    return reviewsData.reviews
        .filter(r => r.productId === Number(productId))
        .map(r => {
            const user = usersData.users.find(u => u.id === r.userId);

            return {
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                user: user
                    ? {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email
                    }
                    : null
            };
        });
}

/** Thống kê rating */
export async function getReviewStats(productId) {
    const reviews = reviewsData.reviews.filter(
        r => r.productId === Number(productId)
    );

    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0
        };
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);

    return {
        averageRating: Number((total / reviews.length).toFixed(1)),
        totalReviews: reviews.length
    };
}
