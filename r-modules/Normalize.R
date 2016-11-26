
x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[1])[,2]
normalized = (x-min(x))/(max(x)-min(x))
i = 1
for (i in x) {
	normalized_list <- append(normalized[[i]], y[[i]])
	
}


return(normalized_list)

