#! /usr/bin/python3
"""
Parse matches times from the Lichess thread
"""
import sys
import json
import csv
import parsedatetime
from urllib.parse import urlencode
import requests
try: 
    from BeautifulSoup import BeautifulSoup
except ImportError:
    from bs4 import BeautifulSoup
from datetime import datetime, date, timedelta
calandar = parsedatetime.Calendar()
source_date = datetime(2020, 9, 1, 0, 0, 0)


def get_games(opponent1, opponent2, start_date, end_date):
    search_params = {
        "players.a": opponent1,
        "players.b": opponent2,
        #"perf": 50,
        # TC in the tournoment is 2+2
        "clock.initMin": 120,
        "clock.initMax": 120,
        "clock.incMin": 2,
        "clock.incMax": 2,
        "dateMin": str(start_date),
        "dateMax": str(end_date),
        "sort.field": "d",
        "sort.order": "asc"
    }
    search_url = "https://lichess.org/games/search?" + urlencode(search_params)
    print(search_url)
    response = requests.get(search_url)
    parsed_response = BeautifulSoup(response.content, features='html.parser')
    game_ids = []
    for game_row in parsed_response.find_all('article', class_='game-row'):
        game_link_element = game_row.find_all('a', class_='game-row__overlay')[0]
        game_id = game_link_element['href'].split('/')[1]
        game_ids.append(game_id)
    return game_ids


def parse_match_line(line):
    words = line.split(' ')
    return words[0].strip('@').rstrip(','), words[2].strip('@').rstrip(','), calandar.parse(' '.join(words[3:]), sourceTime=source_date)


def parse_result_line(line):
    return [float(i) for i in line.split('-')]

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} ROUND_FILE")
        return

    matches = []
    with open(sys.argv[1]) as round_f:
        round_reader = csv.reader(round_f, delimiter='\t')
        for match_line, result_text in round_reader:
            opponent1, opponent2, parsed_date = parse_match_line(match_line)
            try:
                result = parse_result_line(result_text)
            except ValueError:
                result = None
            time_struct, status = parsed_date
            if status == 3:
                match_time = datetime(*time_struct[:6])
                games = get_games(opponent1, opponent2, match_time.date() - timedelta(days=1), match_time.date() + timedelta(days=1))
            else:
                print("Failed to parse datetime")
                match_time = ""
                games = []

            matches.append({
                "opponents": [opponent1, opponent2],
                "result": result,
                "date": str(match_time),
                "games": games
            })

    print(json.dumps(matches, indent=1))


if __name__ == "__main__":
    main()
