export const sortData = (data) => {
    const sortedData = [...data];
    // sortedData.sort((first,second)=>{
    //     if(first.cases > second.cases){
    //         return -1;
    //     } else {
    //         return 1
    //     }
    // });

    // return sortedData;
    return sortedData.sort((first, second) => (first.cases > second.cases ? -1 : 1))
}