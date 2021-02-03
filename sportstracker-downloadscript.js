// originally from http://druss.co/2016/04/export-all-workouts-from-sports-tracker/
// adapted by Konstatinos Sykas: https://gist.github.com/KonstantinosSykas/dfe4c5e392e299ab9341d6e16299454f
// further changed by Mikko Nieminen: 
//	- set script output to use https 
//	- have output file name formatted as 'activity date-activity type-activity description_workout id.gpx'

// to use the script, login to your sports-tracker account and:
// 1. Go to 'Diary' page
// 2. Select 'List' view (or change URL to http://www.sports-tracker.com/diary/workout-list)
// 3-4. set filters to select workouts you want to export
// 5. press "Show More" link in the bottom of the list until all workouts are in the list
// 6. open browser development tools and go to 'console' tab (Cmd-Shift-I)
// 7. paste the script, hit enter - it'll run and print something like this to the console:
// 		curl -o 20201214-Cycling-<activityname>_<..id..>.gpx "https://api.sports-tracker.com/apiserver..."

// Output line count should match the amount of activities in your selection.

// right-click on the console & save or copy-paste these curl commands
// open powershell, change to the directory where you want to save gpx files, run curl commands

var key = "sessionkey=";
var valueStartIndex = document.cookie.indexOf(key) + key.length;
const token_len = 32;
var token = document.cookie.substr(valueStartIndex, token_len);
 
function downloadOne(item) {
	// Get activity type
	var activities = ["Walking", "Running", "Cycling", "CrossCountrySkiing", "Other1", "Other2", "Other3", "Other4", "Other5", "Other6", "MountainBiking", "Hiking", "RollerSkating", "AlpineSkiing", "Paddling", "Rowing", "Golf", "Indoor", "Parkour", "BallGames", "OutdoorGym", "PoolSwimming", "TrailRunning", "Gym", "NordicWalking", "HorsebackRiding", "Motorsports", "Skateboarding", "WaterSports", "Climbing", "Snowboarding", "SkiTouring", "FitnessClass", "Soccer", "Tennis", "Basketball", "Badminton", "Baseball", "Volleyball", "AmericanFootball", "TableTennis", "RacquetBall", "Squash", "Floorball", "Handball", "Softball", "Bowling", "Cricket", "Rugby", "IceSkating", "IceHockey", "Yoga", "IndoorCycling", "Treadmill", "Crossfit", "Crosstrainer", "RollerSkiing", "IndoorRowing", "Stretching", "TrackAndField", "Orienteering", "StandupPaddling", "MartialArts", "Kettlebell", "Dancing", "SnowShoeing", "Frisbee", "Futsal", "Multisport", "Aerobics", "Trekking", "Sailing", "Kayaking", "CircuitTraining", "Triathlon", "Undefined1", "Cheerleading", "Boxing", "ScubaDiving", "FreeDiving", "AdventureRacing", "Gymnastics", "Canoeing", "Mountaineering", "TelemarkSkiing", "OpenwaterSwimming", "Windsurfing", "KitesurfingKiting", "Paragliding", "Undefined2", "Snorkeling", "Surfing", "Swimrun", "Duathlon", "Aquathlon", "ObstacleRacing", "Fishing", "Hunting"]; 
    var activity_type_id = item.children[0].attributes[1].value; 
    var activity_description = item.children[1].attributes[1].value; // span class "description" title attribute value
	var activity_type = activities[activity_type_id]; 
	
	// Get activity date and convert it to YYYYMMDD format
	var activity_summary = item.innerText.substr(item.innerText.indexOf('\n') + 1); 
	var activity_date= activity_summary.substr(0, activity_summary.indexOf('\n')); 
	var activity_year = activity_date.substr(activity_date.lastIndexOf(',') + 2, 4); 
	var activity_month = '00';
	switch(activity_date.substr(0, 3)) {
		case 'Jan':
		  activity_month = '01';
		  break;
		case 'Feb':
		  activity_month = '02';
		  break;
		case 'Mar':
		  activity_month = '03';
		  break;
		case 'Apr':
		  activity_month = '04';
		  break;
		case 'May':
		  activity_month = '05';
		  break;
		case 'Jun':
		  activity_month = '06';
		  break;
		case 'Jul':
		  activity_month = '07';
		  break;
		case 'Aug':
		  activity_month = '08';
		  break;
		case 'Sep':
		  activity_month = '09';
		  break;
		case 'Oct':
		  activity_month = '10';
		  break;
		case 'Nov':
		  activity_month = '11';
		  break;
		case 'Dec':
		  activity_month = '12';
		  break;
	}
	var activity_day = activity_date.substr(4, 2); 
	var twodigits = activity_day.lastIndexOf(',') - 1;
	if (!twodigits) {
		activity_day = '0' + activity_day[0];
	}
	activity_date = activity_year + activity_month + activity_day; 
    
    var href = item.href;
    var id = href.substr(href.lastIndexOf('/') + 1, 24);
    var url = 'https://api.sports-tracker.com/apiserver/v1/workout/exportGpx/' + id + '?token=' + token;
	var filename = activity_date + '-' + activity_type + '-' + activity_description + '_' + id + '.gpx';
    console.log('curl -o "' + filename + '" "' + url + '";sleep 2');
} 

function loopThroughItems(items)
{
    var i = 0;
    for (i = 0; i < items.length; i++) {
        downloadOne(items[i]);
    }
}

var items = document.querySelectorAll("ul.diary-list__workouts li a");
document.body.innerHtml = '';
loopThroughItems(items);