
x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[1])[,2]#this gets the second element of each nested list 
normalized = (x-min(x))/(max(x)-min(x)) #normalizes the second values

normalized_list <- mapply(c, normalized, y, SIMPLIFY=FALSE) #allows the list to return to its orginal format

return(normalized_list)

