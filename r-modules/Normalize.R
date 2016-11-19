
x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
normalized = (x-min(x))/(max(x)-min(x))
