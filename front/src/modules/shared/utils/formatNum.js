const formatNum = (num) => {
    return num?.toLocaleString('en-US', { minimumFractionDigits: 0});
}

export default formatNum