needs("outliers")

x <- as.numeric(do.call(rbind,input[1])[,1]) #this gets the first element of each nested list 
strtoi(x, base = 10)

#this gets the second element of each nested list 
 
outlier_tf <- outlier(x, logical = TRUE)
#This gives an array with all values False, except for the outlier 

find_outlier <- which(outlier_tf == TRUE, arr.ind = TRUE)

x[find_outlier] <- 'NA'

data_new <- as.numeric(x)

y <- do.call(rbind,input[1])[,2]
smooth <- mapply(c, data_new, y, SIMPLIFY=FALSE) #allows the list to return to its orginal format
return (smooth)
