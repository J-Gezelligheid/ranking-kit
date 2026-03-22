const fdu = {};


fdu.getRankingInfo = function(name) {
	let rankingInfo = {};
	rankingInfo.rankings = [];
	rankingInfo.info = '';

	let ranking;
	let name_list = processName(name);
	for(let i = 0; i < name_list.length; i++) {
		ranking = fdu.rankingFullName[name_list[i]];
		if(ranking != null){
			break;
		}
	}
	if (ranking == null) {
		ranking = ""
	}
	else {
		ranking = "FDU " + ranking;
	}

	rankingInfo.rankings.push(ranking);

	return rankingInfo;
}

fdu.getRankingInfoEn = function(name) {
	let rankingInfo = {};
	rankingInfo.rankings = [];
	rankingInfo.info = '';
	let ranking;
	let normalizedName = (name || "").trim().toUpperCase();
	let name_list = processNameEn(normalizedName);
	for(let i = 0; i < name_list.length; i++) {
		ranking = fdu.rankingFullNameEn[name_list[i]];
		if(ranking != null){
			break;
		}
	}
	if (ranking == null) {
		ranking = "";
	} else {
		ranking = "FDU " + ranking;
	}

	rankingInfo.rankings.push(ranking);

	return rankingInfo;
}




fdu.getRankingClass = function(rankings) {
	for (let result of rankings) { // 
		if (result == "FDU A") {
			return 'fdu-A';
		} else if (result == "FDU A-") {
			return 'fdu-A-';
		} else if (result == "FDU B") {
			return 'fdu-B';
		} else if (result == "FDU C") {
			return 'fdu-C';
		} 
	}
	return 'fdu-none';
}

fdu.getRankingSpan = function(name) {
	let rankingInfo = fdu.getRankingInfo(name);
	let span = $('<span>').addClass(fdu.getRankingClass(rankingInfo.rankings)).text(
		rankingInfo.rankings.join('/'));
	if (fdu.getRankingClass(rankingInfo.rankings) != "fdu-none"){
		span.addClass("ccf-ranking");
	}
	return span;
}

fdu.getRankingSpanEn = function(name) {
	let rankingInfo = fdu.getRankingInfoEn(name);
	let span = $('<span>').addClass(fdu.getRankingClass(rankingInfo.rankings)).text(
		rankingInfo.rankings.join('/'));
	if (fdu.getRankingClass(rankingInfo.rankings) != "fdu-none"){
		span.addClass("ccf-ranking");
	}
	return span;
}
