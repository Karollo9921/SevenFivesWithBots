const stakeHierarchy = []

for (var i = 1; i < 21; i++) {
    for (let j = 1; j < 7; j++) {
        let toPush = [];
        for (let k = 1; k < (i + 1) ; k++) {
            toPush.push(j)
            // console.log(toPush);
        }
        stakeHierarchy.push(toPush)
    }
}


console.log(
    stakeHierarchy[21], 
    stakeHierarchy[22],
    stakeHierarchy[23], 
    stakeHierarchy[24], 
    stakeHierarchy[25], 
    stakeHierarchy[26], 
    stakeHierarchy[27]
    );