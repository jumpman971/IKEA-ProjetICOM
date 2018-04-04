
%{
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	extern int yylex();


	// Variables utilisées
	int quantite;
	int loopCount;
	int nbCoordonnees;
	int estIncorrect;
	int numMessage = 0;
	int sizeMessage;
	int sizeCodeJS;
	int superficie;
	int tabAbs[20];
	int tabOrd[20];
	int tabRot[20];

	// gestion strings
	char* nomMessage;
	char* codeJS;
	char* messageRetourne;
	char  strInitialisation[] = "loadFurniture('Evier', ['111111', '111111']);loadFurniture('Four', ['111', '111', '111']);loadFurniture('Refrigerateur', ['11', '11', '11']);loadFurniture('Lave-vaisselle', ['11', '11']);loadFurniture('Comptoir', ['000001', '111111']);loadFurniture('Table', ['1111', '1111']);";
	

	void updateNomMessage(char *nom, int* num)
	{
		*num=*num+1;
		nom[0] = '\0';
		sprintf(nom,"%s%d","received",*num);
	}


	void buildMessage(char *message, char *nomMessage,char *code,int* lengthMessage)
	{
		*lengthMessage = 0;
		message[0] = '\0';
		sprintf(message,"%s%s%s%s%s","if (typeof ",nomMessage," === 'undefined' || !",nomMessage,") {");
		sprintf(message,"%s%s",message,code);
		*lengthMessage = sprintf(message,"%s%s%s",message,nomMessage," = true;}");
		code[0] = '\0';
	}

	void sendMessage(char *message,int sizeMessage,char *nomMessage,int* numMessage)
	{
		FILE *fp;
   		fp = fopen( "../js/com.js" , "w" );
   		fwrite(message , 1 , sizeMessage , fp );
   		fclose(fp);
		updateNomMessage(nomMessage,numMessage);
	}

	void addMeuble(char *code, char *nomMeuble,int x,int y,int rot,int* lengthCode)
	{
		*lengthCode = sprintf(code,"%s%s%s%s%d%s%d%s",code,"addFurnitureToRoom(\"",nomMeuble,"\",",x,",",y,");");
		if(rot)
			*lengthCode = sprintf(code,"%s%s%d%s%d%s",code,"rotateFurniture(",x,",",y,");");
	} 
	
	void delMeuble(char *code,int x,int y,int* lengthCode)
	{
		*lengthCode = sprintf(code,"%s%s%d%s%d%s",code,"removeFurniture(",x,",",y,",false);");
	}

	void rotMeuble(char *code,int x,int y,int* lengthCode)
	{
		*lengthCode = sprintf(code,"%s%s%d%s%d%s",code,"rotateFurniture(",x,",",y,");");
	}

	void moveMeuble(char *code,int x0,int y0,int x,int y,int* lengthCode)
	{
		*lengthCode = sprintf(code,"%s%s%d%s%d%s%d%s%d%s",code,"moveFurniture(",x0,",",y0,",",x,",",y,");");
	}

	void clearFile()
	{
		FILE *fp;
   		fp = fopen( "../js/com.js" , "w" );
   		fclose(fp);
	}
	
	int yyerror (char const *message) 
	{
		fputs (message, stderr); 
		fputc ('\n', stderr); 
		return 0;
	}
	
	void checkErreur()
	{
		if (quantite != nbCoordonnees)
			estIncorrect = 1;
	}
	
	void initVars()
	{
		nbCoordonnees = 0;estIncorrect = 0;quantite = 0;loopCount = 1;
	}
	
%}


%start S
%union { int num; char* str; Coord crd;  }
%token Rotation Move eol Exit
%token <num> Quantite
%token <crd> Coordonnees
%token <str> Meuble
%left Retrait
%type <str> E
%type <str> C
%code requires {
    typedef struct 
	{
    		int x;
    		int y;
		int rot;
	} Coord;
}

%%
S :	
	| S Exit eol					{clearFile();exit(0);}
	| S C eol					{
								if (estIncorrect)
									yyerror("Number of coordinates doesn't match to quantity");
								else
								{	
									buildMessage(messageRetourne,nomMessage,codeJS,&sizeMessage);
									sendMessage(messageRetourne,sizeMessage,nomMessage,&numMessage);
									printf("Commande envoyée\n");
								}
								initVars();
							} 
	| S error eol					{yyerrok;}

C :	 C E	
	|E

E :	  Meuble Coordonnees				{
								addMeuble(codeJS,$1,$2.x,$2.y,0,&sizeCodeJS);
							}
	| Meuble Coordonnees Rotation			{
								addMeuble(codeJS,$1,$2.x,$2.y,1,&sizeCodeJS);
							}
	| Quantite Meuble T				{
								quantite = quantite + $1;
								checkErreur();
								
								if(quantite == 1)
									addMeuble(codeJS,$2,tabAbs[0],tabOrd[0],tabRot[0],&sizeCodeJS);
								else
								{
									int i;
									for(i=0;i<quantite;i++)
									{
										addMeuble(codeJS,$2,tabAbs[i],tabOrd[i],tabRot[i],&sizeCodeJS);
									}
								}
							}
	| Retrait Coordonnees			 	{
								delMeuble(codeJS,$2.x,$2.y,&sizeCodeJS);
							}
	| Rotation Coordonnees			 	{
								rotMeuble(codeJS,$2.x,$2.y,&sizeCodeJS);
							}
	| Move Coordonnees Coordonnees			{
								moveMeuble(codeJS,$2.x,$2.y,$3.x,$3.y,&sizeCodeJS);
							}

T :	  Coordonnees					{
								nbCoordonnees++;
								tabAbs[0] = $1.x;
								tabOrd[0] = $1.y;
								tabRot[0] = 0;
							}
	| Coordonnees Rotation				{
								nbCoordonnees++;
								tabAbs[0] = $1.x;
								tabOrd[0] = $1.y;
								tabRot[0] = 1;
							}
	| T Coordonnees					{
								nbCoordonnees++;
								tabAbs[loopCount] = $2.x;
								tabOrd[loopCount] = $2.y;
								tabRot[loopCount] = 0;
								loopCount++;
							}
	| T Coordonnees Rotation			{
								nbCoordonnees++;
								tabAbs[loopCount] = $2.x;
								tabOrd[loopCount] = $2.y;
								tabRot[loopCount] = 1;
								loopCount++;
							};
	
%%


int main(void) 
{
	//Allocations
	codeJS = (char*)malloc(sizeof(char)*500);
	messageRetourne = (char*)malloc(sizeof(char)*500);
	nomMessage = (char*)malloc(sizeof(char)*20);
	
	
	
	//Initialiser les éléments
	updateNomMessage(nomMessage,&numMessage);
	buildMessage(messageRetourne,nomMessage,strInitialisation,&sizeMessage);
	sendMessage(messageRetourne,sizeMessage,nomMessage,&numMessage);

	//Choix de la superficie
	printf("Console IKEA\n\nVeuillez entrer la longueur du côté de la piece (entier) : ");
	scanf("%d",&superficie);
	sprintf(codeJS,"%s%d%s","setRoomSize(",superficie,");");
	buildMessage(messageRetourne,nomMessage,codeJS,&sizeMessage);
	sendMessage(messageRetourne,sizeMessage,nomMessage,&numMessage); 

	initVars();


	return yyparse();
	

}
