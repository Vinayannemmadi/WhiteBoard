

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
    const distToLine = perpendicularDistanceToLine(x1, y1, x2, y2, pointX, pointY);
    return distToLine < 1.5;
};

export const perpendicularDistanceToLine = (x1, y1, x2, y2, pointX, pointY) => {
    const A = pointX - x1;
    const B = pointY - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) {
        param = dot / len_sq;
    }

    let nearestX, nearestY;

    if (param < 0) {
        nearestX = x1;
        nearestY = y1;
    } else if (param > 1) {
        nearestX = x2;
        nearestY = y2;
    } else {
        nearestX = x1 + param * C;
        nearestY = y1 + param * D;
    }

    return distanceBetweenPoints(pointX, pointY, nearestX, nearestY);
};

export const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const getArrowHeadsCoordinates=(x1,y1,x2,y2,arrowLength) =>{
    const angle=Math.atan2(y2-y1,x2-x1);
    const x3=x2-arrowLength*Math.cos(angle-Math.PI/6);
    const y3=y2-arrowLength*Math.sin(angle-Math.PI/6);
    const x4=x2-arrowLength*Math.cos(angle+Math.PI/6);
    const y4=y2-arrowLength*Math.sin(angle+Math.PI/6);
    return {x3,y3,x4,y4};
}
