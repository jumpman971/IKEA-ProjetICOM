%{
	#include <stdio.h>
	#include <string.h>
	#include "y.tab.h"
	
	/*
	 * Fonction strCoordToInts
	 * Description: lit des coordonnées en chaine de caractère et copie l'abscisse et l'ordonnée dans les
	 *		entiers entrés en paramètre
	 * 
	 * strCoord: Coordonnées en chaine de caractères
	 * x: abscisse.
	 * y: ordonnée.
	 *
	 * retourne: rien
	 */
	void strCoordToInts(char* strCoord, int* x, int* y)
	{
	  	char * separator = ",";
		char * a = strtok(strCoord, separator);
		*x = atoi(a);
		char * b = strtok(NULL, "");
		*y = atoi(b);
	}

%}

ENTIER [0-9]+
STRING [A-Za-z]+
SPACE  " "

%%

\n						{return eol;}
"exit"						{return Exit;}
{ENTIER}					{yylval.num = atoi(yytext);return Quantite;}
"-"						{return Retrait;}
(rotate|Rotation|Rotate|rotation)		{return Rotation;}
(move|Move)					{return Move;}
{STRING}({SPACE}+{STRING})* 			{yylval.str = strdup(yytext);return Meuble;}
({ENTIER},{ENTIER}) 				{strCoordToInts(yytext,&yylval.crd.x,&yylval.crd.y);return Coordonnees;}

.						{;}
%%

int yywrap () {return 1;}
