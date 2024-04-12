#!/bin/bash

source colors.sh
clear

CLIENT_PATH=client
GRAPH_PATH=graph
START_STRING='./start.sh'
PAT1="Клиент для работы с виброметром"
PAT2="Клиент для проверки показаний датчика"
Quit="ОТМЕНА И ВЫХОД"
EXIT_STRING="${On_Blue}\n    -- ЗАВЕРШЕНИЕ РАБОТЫ --    \n\n${White}${Color_off}"

if [ ! -d "$CLIENT_PATH" ]; then
  printf "\n${Red}$PAT1 не обнаружен. \n$EXIT_STRING${Color_off}\n\n"
	exit 0
fi

if [ ! -d "$GRAPH_PATH" ]; then
  printf "\n${Red}$PAT2 не обнаружен. \n$EXIT_STRING${Color_off}\n\n"
	exit 0
fi

printf "${Blue}ВЫБОР ПРИЛОЖЕНИЯ:\n${White}"

options=("$PAT1" "$PAT2" "$Quit")

select opt in "${options[@]}"
do
    case $opt in
        "$PAT1")
					printf "\n${White}ЗАПУСК: ${On_Green}$PAT1${Color_off}\n\n"
					cd $CLIENT_PATH
					$START_STRING
          break
            ;;
        "$PAT2")
					printf "\n${White}ЗАПУСК: ${On_Green}$PAT2${Color_off}\n\n"
					cd $GRAPH_PATH
					$START_STRING
          break
            ;;
        "$Quit")
          printf "$EXIT_STRING"
          exit 0
            ;;
        *) echo "Ошибка! Повторите выбор. $REPLY";;
    esac
done